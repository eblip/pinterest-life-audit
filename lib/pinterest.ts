export type Pin = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  date?: string;
};

export type BoardData = {
  boardUrl: string;
  username: string;
  board: string;
  pins: Pin[];
};

const RESERVED = new Set(["pin", "ideas", "search", "today", "business", "explore"]);

/** Extrait { username, board } d'une URL de tableau Pinterest. */
export function parseBoardUrl(input: string): { username: string; board: string } | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!/(^|\.)pinterest\.[a-z.]+$/i.test(u.hostname)) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const username = decodeURIComponent(parts[0]);
    const board = decodeURIComponent(parts[1]).replace(/\.rss$/i, "");
    if (RESERVED.has(username.toLowerCase())) return null;
    return { username, board };
  } catch {
    return null;
  }
}

export function rssUrl(username: string, board: string): string {
  return `https://www.pinterest.com/${encodeURIComponent(username)}/${encodeURIComponent(board)}.rss`;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

function tagContent(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^\s*<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim();
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Pinterest sert des vignettes 236x ; on demande une version plus grande. */
function upscale(url: string): string {
  return url.replace(/\/(?:\d+x)(?:\/|_)/, (m) => m.replace(/\d+x/, "736x"));
}

/** Parse le flux RSS d'un tableau Pinterest en liste d'épingles. */
export function parseRss(xml: string): Pin[] {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const pins: Pin[] = [];

  items.forEach((item, index) => {
    const rawDesc = tagContent(item, "description");
    const descHtml = decodeEntities(rawDesc);
    const img = descHtml.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
    if (!img) return;

    const link = stripHtml(tagContent(item, "link")) || stripHtml(tagContent(item, "guid"));
    const title = stripHtml(tagContent(item, "title"));
    const description = stripHtml(descHtml);
    const idMatch = link.match(/\/pin\/(\d+)/);

    pins.push({
      id: idMatch?.[1] ?? `pin-${index}`,
      title,
      description: description === title ? "" : description,
      image: upscale(img),
      link,
      date: stripHtml(tagContent(item, "pubDate")) || undefined,
    });
  });

  return pins;
}

export class BoardError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function fetchBoard(input: string): Promise<BoardData> {
  const parsed = parseBoardUrl(input);
  if (!parsed) {
    throw new BoardError(
      "URL invalide. Utilisez l'adresse complète d'un tableau, par ex. https://www.pinterest.com/utilisateur/nom-du-tableau/",
      400,
    );
  }

  const res = await fetch(rssUrl(parsed.username, parsed.board), {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; PinterestLifeAudit/0.1)",
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.5",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  }).catch(() => {
    throw new BoardError("Impossible de joindre Pinterest. Réessayez dans un instant.", 502);
  });

  if (res.status === 404) {
    throw new BoardError("Tableau introuvable. Vérifiez l'URL et que le tableau est bien public.", 404);
  }
  if (!res.ok) {
    throw new BoardError(`Pinterest a répondu avec le code ${res.status}.`, 502);
  }

  const pins = parseRss(await res.text());
  if (pins.length === 0) {
    throw new BoardError("Aucune épingle trouvée. Le tableau est peut-être vide ou privé.", 404);
  }

  return {
    boardUrl: `https://www.pinterest.com/${parsed.username}/${parsed.board}/`,
    username: parsed.username,
    board: parsed.board,
    pins,
  };
}
