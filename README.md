# MediaCBD

Frontend éditorial CBD (React + TypeScript + Vite + Tailwind) inspiré de l’architecture d’un média pro, avec annuaire filtrable.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide Icons

## Démarrage

```bash
npm install
npm run dev
```

Build production :

```bash
npm run build
npm run preview
```

## Structure utile

- `src/data/` — articles et annuaire d’exemple (remplaçables)
- `src/services/contentRepository.ts` — couche d’accès données (prête pour CSV/JSON/API Django)
- `src/pages/` — pages éditoriales + annuaire
- `src/components/` — layout et composants UI

## Remplacer les données annuaire

1. Déposer votre fichier (CSV/JSON) dans le projet
2. Adapter le mapping dans `src/data/directory.ts` ou brancher un loader dans `contentRepository.ts`
3. Garder le typage `DirectoryBusiness` pour éviter de casser l’UI

## Domaine cible

`mediacbd.fr`
