import { CATEGORIES, type Category } from "./categories";
import type { Pin } from "./pinterest";

export type Theme = {
  id: string;
  label: string;
  emoji: string;
  count: number;
  share: number; // 0-100
  pinIds: string[];
  keywords: string[]; // mots-clés les plus détectés
};

export type Recommendation = {
  themeId: string;
  label: string;
  emoji: string;
  insight: string;
  actions: string[];
};

export type PlanWeek = {
  week: number;
  title: string;
  focus: string;
  tasks: string[];
};

export type Audit = {
  totalPins: number;
  categorized: number;
  uncategorized: number;
  themes: Theme[];
  dominant: Theme[];
  missing: Category[];
  balanceScore: number; // 0-100
  balanceLabel: string;
  profile: string;
  recommendations: Recommendation[];
  plan: PlanWeek[];
  questions: string[];
  pinCategory: Record<string, string | null>;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matches(norm: string, tokens: string[], kw: string): boolean {
  if (kw.includes(" ")) return ` ${norm} `.includes(` ${kw} `);
  if (kw.length <= 4) return tokens.includes(kw);
  return tokens.some((t) => t.startsWith(kw));
}

/** Pour un texte, retourne les points par catégorie et les mots-clés touchés. */
function scoreText(text: string) {
  const norm = normalize(text);
  const tokens = norm.split(" ").filter(Boolean);
  const scores = new Map<string, number>();
  const hits = new Map<string, string[]>();
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (matches(norm, tokens, kw)) {
        scores.set(cat.id, (scores.get(cat.id) ?? 0) + 1);
        hits.set(cat.id, [...(hits.get(cat.id) ?? []), kw]);
      }
    }
  }
  return { scores, hits };
}

function balanceOf(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let entropy = 0;
  for (const c of counts) {
    if (c === 0) continue;
    const p = c / total;
    entropy -= p * Math.log(p);
  }
  return Math.round((entropy / Math.log(CATEGORIES.length)) * 100);
}

function balanceLabel(score: number): string {
  if (score >= 70) return "Très varié : vos inspirations couvrent de nombreux domaines de vie.";
  if (score >= 45) return "Équilibré : quelques thèmes forts, avec une belle diversité.";
  if (score >= 25) return "Concentré : un ou deux domaines dominent nettement.";
  return "Très focalisé : votre tableau tourne autour d'un seul sujet.";
}

export function analyzeBoard(pins: Pin[]): Audit {
  const counts = new Map<string, number>();
  const pinIds = new Map<string, string[]>();
  const kwCounts = new Map<string, Map<string, number>>();
  const pinCategory: Record<string, string | null> = {};

  for (const pin of pins) {
    const { scores, hits } = scoreText(`${pin.title} ${pin.description}`);
    let best: string | null = null;
    let bestScore = 0;
    for (const cat of CATEGORIES) {
      const s = scores.get(cat.id) ?? 0;
      if (s > bestScore) {
        best = cat.id;
        bestScore = s;
      }
    }
    pinCategory[pin.id] = best;
    if (!best) continue;

    counts.set(best, (counts.get(best) ?? 0) + 1);
    pinIds.set(best, [...(pinIds.get(best) ?? []), pin.id]);
    const m = kwCounts.get(best) ?? new Map<string, number>();
    for (const kw of hits.get(best) ?? []) m.set(kw, (m.get(kw) ?? 0) + 1);
    kwCounts.set(best, m);
  }

  const categorized = [...counts.values()].reduce((a, b) => a + b, 0);

  const themes: Theme[] = CATEGORIES.filter((c) => (counts.get(c.id) ?? 0) > 0)
    .map((c) => ({
      id: c.id,
      label: c.label,
      emoji: c.emoji,
      count: counts.get(c.id) ?? 0,
      share: categorized ? Math.round(((counts.get(c.id) ?? 0) / categorized) * 100) : 0,
      pinIds: pinIds.get(c.id) ?? [],
      keywords: [...(kwCounts.get(c.id)?.entries() ?? [])]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k]) => k),
    }))
    .sort((a, b) => b.count - a.count);

  const dominant = themes.slice(0, 3);
  const present = new Set(themes.map((t) => t.id));
  const coreAreas = ["sante", "relations", "mind", "career", "nature"];
  const missing = CATEGORIES.filter((c) => coreAreas.includes(c.id) && !present.has(c.id));

  const score = balanceOf(CATEGORIES.map((c) => counts.get(c.id) ?? 0));

  const profile = buildProfile(dominant, pins.length, categorized);

  const recommendations: Recommendation[] = dominant.map((t) => {
    const cat = CATEGORIES.find((c) => c.id === t.id)!;
    return { themeId: t.id, label: t.label, emoji: t.emoji, insight: cat.insight, actions: cat.actions };
  });

  const plan = buildPlan(dominant, missing);

  const questions = [
    ...dominant.flatMap((t) => CATEGORIES.find((c) => c.id === t.id)?.questions ?? []),
    ...missing.slice(0, 2).map((c) => `Votre tableau ne parle pas de « ${c.label.toLowerCase()} » : est-ce un choix ou un angle mort ?`),
    "Parmi ces inspirations, laquelle pourriez-vous concrétiser dès cette semaine ?",
  ];

  return {
    totalPins: pins.length,
    categorized,
    uncategorized: pins.length - categorized,
    themes,
    dominant,
    missing,
    balanceScore: score,
    balanceLabel: balanceLabel(score),
    profile,
    recommendations,
    plan,
    questions,
    pinCategory,
  };
}

function buildProfile(dominant: Theme[], total: number, categorized: number): string {
  if (dominant.length === 0) {
    return `Sur ${total} épingles, aucun thème clair n'a pu être détecté : les titres sont probablement trop courts ou peu descriptifs. Essayez un tableau dont les épingles ont des titres explicites.`;
  }
  const names = dominant.map((t) => `${t.emoji} ${t.label.toLowerCase()}`);
  const list =
    names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}`;
  const coverage = Math.round((categorized / total) * 100);
  return `Sur ${total} épingles, ${coverage} % ont pu être rattachées à un thème. Votre tableau est dominé par ${list}. Ces thèmes dessinent la vie que vous voulez construire : le plan ci-dessous vous aide à passer de l'inspiration à l'action.`;
}

function buildPlan(dominant: Theme[], missing: Category[]): PlanWeek[] {
  const catOf = (id: string) => CATEGORIES.find((c) => c.id === id)!;
  const first = dominant[0] ? catOf(dominant[0].id) : null;
  const second = dominant[1] ? catOf(dominant[1].id) : null;
  const third = dominant[2] ? catOf(dominant[2].id) : null;
  const gap = missing[0] ?? null;

  const plan: PlanWeek[] = [
    {
      week: 1,
      title: "Clarifier",
      focus: "Transformer l'envie en intention",
      tasks: [
        "Relire votre tableau et surligner les 5 épingles qui vous touchent le plus.",
        "Écrire en une phrase la vie que ces épingles décrivent.",
        ...(first ? [first.actions[0]] : []),
      ],
    },
    {
      week: 2,
      title: "Commencer petit",
      focus: first ? `${first.emoji} ${first.label}` : "Premier thème",
      tasks: first ? [first.actions[1], first.actions[2]] : ["Choisir un thème et une action de 15 minutes."],
    },
    {
      week: 3,
      title: "Élargir",
      focus: second ? `${second.emoji} ${second.label}` : "Deuxième thème",
      tasks: second
        ? [second.actions[0], second.actions[1], ...(third ? [third.actions[0]] : [])]
        : ["Choisir un deuxième domaine à explorer."],
    },
    {
      week: 4,
      title: "Équilibrer & bilan",
      focus: gap ? `${gap.emoji} ${gap.label} (angle mort)` : "Bilan du mois",
      tasks: [
        ...(gap ? [gap.actions[0]] : []),
        "Faire le bilan : qu'ai-je réellement fait, qu'est-ce qui m'a plu ?",
        "Créer un nouveau tableau « Ce que j'ai concrétisé » avec vos réalisations.",
      ],
    },
  ];
  return plan;
}
