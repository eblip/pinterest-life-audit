"use client";

import { CATEGORIES } from "@/lib/categories";
import type { Pin } from "@/lib/pinterest";

type Props = {
  pins: Pin[];
  pinCategory: Record<string, string | null>;
  filter: string | null;
  onFilter: (id: string | null) => void;
  counts: Record<string, number>;
};

export default function PinGrid({ pins, pinCategory, filter, onFilter, counts }: Props) {
  const visible = filter ? pins.filter((p) => pinCategory[p.id] === filter) : pins;
  const usedCats = CATEGORIES.filter((c) => (counts[c.id] ?? 0) > 0);

  return (
    <section>
      <div className="filters" role="group" aria-label="Filtrer par thème">
        <button className="chip" aria-pressed={filter === null} onClick={() => onFilter(null)}>
          Tout ({pins.length})
        </button>
        {usedCats.map((c) => (
          <button
            key={c.id}
            className="chip"
            aria-pressed={filter === c.id}
            onClick={() => onFilter(filter === c.id ? null : c.id)}
          >
            {c.emoji} {c.label} ({counts[c.id]})
          </button>
        ))}
      </div>

      <div className="grid">
        {visible.map((pin) => {
          const cat = CATEGORIES.find((c) => c.id === pinCategory[pin.id]);
          return (
            <a key={pin.id} className="pin" href={pin.link} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pin.image} alt={pin.title || "Épingle Pinterest"} loading="lazy" referrerPolicy="no-referrer" />
              <div className="meta">
                {pin.title && <p className="t">{pin.title}</p>}
                {cat && (
                  <p className="c">
                    {cat.emoji} {cat.label}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
