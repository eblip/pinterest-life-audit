# Pinterest Life Audit

Application web minimaliste et gratuite (Next.js 15, App Router, TypeScript) : on colle l'URL d'un tableau Pinterest **public**, l'app extrait les épingles (titres, descriptions, images), les classe par thèmes de vie et génère un audit + un plan d'action sur 4 semaines.

## Lancer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Aucune clé d'API, aucune base de données.

## Fonctionnement

1. `app/api/board/route.ts` reçoit l'URL, `lib/pinterest.ts` la valide et lit le flux RSS public
   `https://www.pinterest.com/<utilisateur>/<tableau>.rss` côté serveur (évite les problèmes de CORS).
2. `lib/analyze.ts` classe chaque épingle (titre + description) dans l'une des 11 catégories de `lib/categories.ts`
   (mots-clés FR/EN, sans accents), puis calcule répartition, score de diversité, angles morts, recommandations
   et plan sur 4 semaines. Tout est exécuté dans le navigateur.
3. `components/PinGrid.tsx` affiche la grille (masonry CSS) filtrable par thème ; `components/AuditReport.tsx`
   affiche l'audit avec des actions cochables (sauvegardées en `localStorage`).

## Limites connues

- Le flux RSS ne renvoie qu'une partie du tableau (en général les épingles les plus récentes, quelques dizaines).
- Les tableaux privés, les liens courts `pin.it` et les tableaux vides ne sont pas supportés.
- L'analyse repose sur les titres/descriptions : des épingles sans texte ne seront pas classées.
- Pinterest peut modifier ou limiter ce flux à tout moment ; si cela arrive, seul `lib/pinterest.ts` est à adapter.

## Pistes d'évolution

- Enrichir les mots-clés ou en faire un fichier éditable par thème.
- Ajouter l'analyse visuelle des images (modèle de vision) pour les épingles sans texte.
- Export PDF/Markdown de l'audit, partage d'un lien.
