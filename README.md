# FarmAqualarm · vidéos motion

Projet [Remotion](https://www.remotion.dev) servant de template aux vidéos FarmAqualarm (une solution Farmaqua).
Première vidéo : spot de 20 s, 30 i/s, format 4:5 (1080 × 1350). Le même composant sort aussi du 1:1 et du 9:16.

## Commandes

```bash
npm install
npm run render        # → out/farmaqualarm-4x5.mp4
npm run render:1x1    # → out/farmaqualarm-1x1.mp4  (1080 × 1080)
npm run render:9x16   # → out/farmaqualarm-9x16.mp4 (1080 × 1920)
npm run render:all    # les trois
npm run still         # image fixe (frame 90) pour contrôle rapide
npm run studio        # prévisualisation interactive dans le navigateur
npm run typecheck
```

Rendu h264, CRF 18, yuv420p (compatible réseaux sociaux) : voir `remotion.config.ts`.

## Storyboard

| Temps | Scène | Fichier |
|---|---|---|
| 0–2 s | Supervision de nuit, pastille verte, valeurs qui défilent | `src/scenes/MonitorScene.tsx` |
| 2–6 s | Chute d'O2, pastille vert → ambre → rouge | `src/scenes/MonitorScene.tsx` |
| 6–10 s | 3 jauges animées (O2, °C, pH) | `src/scenes/GaugesScene.tsx` |
| 10–14 s | Coupure secteur / Internet, règles locales, pompe de secours, retour au vert | `src/scenes/OfflineScene.tsx` |
| 14–17 s | Labels : 8 sorties, alertes, étalonnage, récap | `src/scenes/FeaturesScene.tsx` |
| 17–20 s | La pastille se pose sur le logo, signature, appel à l'action | `src/scenes/OutroScene.tsx` |

Le motif central est la **pastille d'état** (`src/components/StatusPulse.tsx`). Sa couleur découle
directement de la courbe d'oxygène (`o2At` dans `src/timeline.ts`) : vert ≥ 5,0 mg/L, ambre ≥ 4,0, rouge en dessous.
Au plan final elle vole jusqu'à la pastille du logo et reprend l'ambre de la charte (§ 1.6 : hors application, la pastille reste ambre).

## Réutiliser le template

Toutes les compositions utilisent le composant `FarmAqualarm`, paramétré par des props validées par zod (`src/schema.ts`) :

- `format` : `"1:1"`, `"4:5"` ou `"9:16"`. Les dimensions et la mise en page suivent (`src/layout.ts`).
- `texts` : surtitre, titres incrustés, labels, règles, signature, appel à l'action.
  Dans un titre, un passage entre `*astérisques*` est mis en valeur en teal.
  Dans `cta`, la partie avant le `·` devient le bouton, le reste s'affiche en dessous.
- `colors` : palette de la charte (fond nuit, teal vif, couleurs d'état, ambre...).
- `logo` : image dans `public/`, couleur de fond, position de la pastille du logo (fractions de l'image).
- `music` : bande-son (`src` dans `public/`, `volume`). Lue en boucle si plus courte que la vidéo,
  fondu d'entrée 0,5 s et de sortie 1 s. `"src": ""` pour une version muette.
- `showSafeZones` : affiche les repères (zone sûre en magenta, zone visuelle en cyan, zone de titre en jaune).

Exemples :

```bash
# 9:16 à partir de la composition 4:5
npx remotion render FarmAqualarm-4x5 out/test-9x16.mp4 --props='{"format":"9:16"}'

# Contrôler les safe zones sur une image
npx remotion still FarmAqualarm-9x16 out/safe.png --frame=150 --props='{"showSafeZones":true}'

# Textes personnalisés depuis un fichier JSON (props complètes)
npx remotion render FarmAqualarm-4x5 out/variante.mp4 --props=./variante.json
```

Le rythme (découpage des scènes, courbe d'O2, instants clés) est centralisé dans `src/timeline.ts`.

### Safe zones

Les marges de chaque format sont dans `FORMATS` (`src/layout.ts`). En 9:16, 250 px en haut et 420 px en bas
sont laissés libres pour l'interface de Reels / TikTok / Shorts ; aucun texte n'y est posé.

## Ressources

- `public/Farmaqualarm-lockup-fond-profond.png` : lockup horizontal sur fond profond (#0F3D57).
  Le plan final fond l'arrière-plan vers cette couleur pour que la découpe de l'image soit invisible.
- `public/musique.mp3` : bande-son d'ambiance (volume 0,18). Purement décorative : tout le propos passe
  par les textes incrustés, la vidéo se comprend sans le son.
- `public/fonts/` : Poppins et JetBrains Mono (Google Fonts, licence SIL OFL, voir les fichiers `OFL-*.txt`).
  Les polices sont embarquées pour que le rendu ne dépende pas du réseau.

## Charte (rappel)

Ton factuel, technique, rassurant, sans exagération. Jamais de prix.
Règle fondamentale : en cas de doute, air activé, nourrissage désactivé, alerte immédiate.
