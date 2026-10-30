"use client";

import { FormEvent, useMemo, useState } from "react";
import AuditReport from "@/components/AuditReport";
import PinGrid from "@/components/PinGrid";
import { analyzeBoard } from "@/lib/analyze";
import type { BoardData } from "@/lib/pinterest";

type Tab = "audit" | "pins";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardData | null>(null);
  const [tab, setTab] = useState<Tab>("audit");
  const [filter, setFilter] = useState<string | null>(null);

  const audit = useMemo(() => (board ? analyzeBoard(board.pins) : null), [board]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    audit?.themes.forEach((t) => (c[t.id] = t.count));
    return c;
  }, [audit]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/board?url=${encodeURIComponent(url.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur inconnue.");
      setBoard(json as BoardData);
      setFilter(null);
      setTab("audit");
    } catch (err) {
      setBoard(null);
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <header className="hero">
        <h1>📌 Pinterest Life Audit</h1>
        <p>
          Collez l'adresse d'un tableau Pinterest public : nous analysons vos épingles pour révéler vos priorités de vie et
          en faire un plan d'action concret.
        </p>
        <form className="form" onSubmit={onSubmit}>
          <input
            type="text"
            inputMode="url"
            placeholder="https://www.pinterest.com/utilisateur/mon-tableau/"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="URL du tableau Pinterest"
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Analyse…" : "Lancer l'audit"}
          </button>
        </form>
        <p className="hint">Le tableau doit être public. Rien n'est stocké : l'analyse se fait à la volée.</p>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
      </header>

      {board && audit && (
        <>
          <p className="board-title">
            Tableau <a href={board.boardUrl} target="_blank" rel="noopener noreferrer">{board.username} / {board.board}</a>
          </p>

          <div className="tabs" role="tablist">
            <button className="tab" role="tab" aria-selected={tab === "audit"} onClick={() => setTab("audit")}>
              Audit &amp; plan d'action
            </button>
            <button className="tab" role="tab" aria-selected={tab === "pins"} onClick={() => setTab("pins")}>
              Épingles ({board.pins.length})
            </button>
          </div>

          {tab === "audit" ? (
            <AuditReport
              audit={audit}
              storageKey={`pla:${board.username}/${board.board}`}
              onSelectTheme={(id) => {
                setFilter(id);
                setTab("pins");
              }}
            />
          ) : (
            <PinGrid
              pins={board.pins}
              pinCategory={audit.pinCategory}
              filter={filter}
              onFilter={setFilter}
              counts={counts}
            />
          )}
        </>
      )}
    </main>
  );
}
