"use client";

import { useEffect, useState } from "react";
import type { Audit } from "@/lib/analyze";

type Props = {
  audit: Audit;
  storageKey: string;
  onSelectTheme: (id: string) => void;
};

export default function AuditReport({ audit, storageKey, onSelectTheme }: Props) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setDone(raw ? (JSON.parse(raw) as Record<string, boolean>) : {});
    } catch {
      setDone({});
    }
  }, [storageKey]);

  const toggle = (key: string) => {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* stockage indisponible : on garde l'état en mémoire */
      }
      return next;
    });
  };

  const totalTasks = audit.plan.reduce((n, w) => n + w.tasks.length, 0);
  const doneTasks = Object.values(done).filter(Boolean).length;

  return (
    <div>
      <div className="stats">
        <div className="stat">
          <div className="n">{audit.totalPins}</div>
          <div className="l">épingles analysées</div>
        </div>
        <div className="stat">
          <div className="n">{audit.themes.length}</div>
          <div className="l">thèmes détectés</div>
        </div>
        <div className="stat">
          <div className="n">{audit.balanceScore}/100</div>
          <div className="l">diversité de vie</div>
        </div>
        <div className="stat">
          <div className="n">
            {doneTasks}/{totalTasks}
          </div>
          <div className="l">actions réalisées</div>
        </div>
      </div>

      <div className="card">
        <h2>Votre profil</h2>
        <p>{audit.profile}</p>
        <p className="kw">{audit.balanceLabel}</p>
      </div>

      {audit.themes.length > 0 && (
        <div className="card">
          <h2>Répartition des thèmes</h2>
          {audit.themes.map((t) => (
            <div key={t.id}>
              <div className="bar-row">
                <button
                  className="btn-ghost"
                  style={{ textAlign: "left", border: 0, padding: 0 }}
                  onClick={() => onSelectTheme(t.id)}
                  title="Voir les épingles de ce thème"
                >
                  {t.emoji} {t.label}
                </button>
                <div className="bar" aria-hidden>
                  <span style={{ width: `${t.share}%` }} />
                </div>
                <span>{t.share} %</span>
              </div>
              {t.keywords.length > 0 && <div className="kw">Mots détectés : {t.keywords.join(", ")}</div>}
            </div>
          ))}
          {audit.uncategorized > 0 && (
            <p className="kw" style={{ marginTop: 12 }}>
              {audit.uncategorized} épingle(s) sans thème identifiable (titres trop courts ou peu descriptifs).
            </p>
          )}
        </div>
      )}

      {audit.recommendations.length > 0 && (
        <div className="card">
          <h2>Ce que votre tableau dit de vous</h2>
          {audit.recommendations.map((r) => (
            <div key={r.themeId} style={{ marginBottom: 16 }}>
              <h3>
                {r.emoji} {r.label}
              </h3>
              <p>{r.insight}</p>
              <ul className="tasks">
                {r.actions.map((a, i) => {
                  const key = `rec-${r.themeId}-${i}`;
                  return (
                    <li key={key}>
                      <label>
                        <input type="checkbox" checked={!!done[key]} onChange={() => toggle(key)} />
                        <span>{a}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {audit.missing.length > 0 && (
        <div className="card">
          <h2>Angles morts possibles</h2>
          <p>Ces domaines n'apparaissent pas dans votre tableau. Ce n'est pas forcément un problème, mais cela vaut le coup d'y réfléchir :</p>
          <p>{audit.missing.map((c) => `${c.emoji} ${c.label}`).join(" · ")}</p>
        </div>
      )}

      <h2 style={{ marginTop: 24 }}>Plan d'action sur 4 semaines</h2>
      <div className="weeks">
        {audit.plan.map((w) => (
          <div className="card week" key={w.week}>
            <span className="badge">Semaine {w.week}</span>
            <h3>{w.title}</h3>
            <p className="kw">{w.focus}</p>
            <ul className="tasks">
              {w.tasks.map((task, i) => {
                const key = `plan-${w.week}-${i}`;
                return (
                  <li key={key}>
                    <label>
                      <input type="checkbox" checked={!!done[key]} onChange={() => toggle(key)} />
                      <span>{task}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Questions pour aller plus loin</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {audit.questions.map((q, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {q}
            </li>
          ))}
        </ul>
        <div className="actions">
          <button className="btn-ghost" onClick={() => window.print()}>
            Imprimer / enregistrer en PDF
          </button>
        </div>
      </div>
    </div>
  );
}
