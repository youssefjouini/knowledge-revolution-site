# The Knowledge Revolution — site du projet (FBAI's)

Site officiel et blog de suivi de notre projet CBL **The Knowledge Revolution — by FBAI's (Future Builders of AI)**.
Le contenu du site est en anglais ; ce guide est en français.

> **Pas besoin d'être développeur.** Presque tout se fait en modifiant des fichiers texte (`.md` ou `.ts`).
> Chaque fois que vous poussez une modification sur GitHub, Vercel remet le site à jour tout seul en 1 à 2 minutes.

---

## Sommaire

1. [Lancer le site sur mon ordinateur](#1-lancer-le-site-sur-mon-ordinateur)
2. [Où se trouve quoi ?](#2-où-se-trouve-quoi-)
3. [Ajouter un article de blog](#3-ajouter-un-article-de-blog)
4. [Ajouter un compte-rendu de réunion](#4-ajouter-un-compte-rendu-de-réunion)
5. [Modifier un membre de l'équipe](#5-modifier-un-membre-de-léquipe)
6. [Modifier les infos générales (email, vidéo, audio…)](#6-modifier-les-infos-générales-email-vidéo-audio)
7. [Remplir la page AI & Methodology](#7-remplir-la-page-ai--methodology)
8. [Mettre à jour la page CBL](#8-mettre-à-jour-la-page-cbl)
9. [Ajouter le modèle 3D de l'avatar (.glb)](#9-ajouter-le-modèle-3d-de-lavatar-glb)
10. [Mettre le site à jour en ligne](#10-mettre-le-site-à-jour-en-ligne)
11. [Mise en ligne la première fois (GitHub + Vercel)](#11-mise-en-ligne-la-première-fois-github--vercel)
12. [Les [TODO] : repérer ce qui manque](#12-les-todo--repérer-ce-qui-manque)
13. [En cas de problème](#13-en-cas-de-problème)

---

## 1. Lancer le site sur mon ordinateur

**À installer une seule fois :**
- [Node.js](https://nodejs.org) (version « LTS », 22 ou plus récent)
- [Git](https://git-scm.com/downloads)
- Un éditeur de texte : [VS Code](https://code.visualstudio.com) est conseillé

**Puis, dans un terminal ouvert dans le dossier du projet :**

```bash
npm install        # une seule fois (ou quand package.json change)
npm run dev        # lance le site
```

Ouvrez **http://localhost:4321** dans votre navigateur. Laissez le terminal ouvert : chaque fois que vous enregistrez un fichier, la page se met à jour toute seule. Pour arrêter : `Ctrl + C`.

**Avant de publier**, vérifiez que tout compile :

```bash
npm run build      # doit se terminer par « Complete! » sans erreur rouge
```

---

## 2. Où se trouve quoi ?

| Je veux modifier… | Fichier / dossier |
|---|---|
| Un article de blog | `src/content/blog/` |
| Un compte-rendu de réunion | `src/content/meetings/` |
| Un membre de l'équipe | `src/content/team/` |
| Email, liens vidéo, audio, phase CBL actuelle | `src/data/site.ts` |
| Pipeline, modèles, datasets, métriques | `src/data/methodology.ts` |
| Contenu des phases Investigate / Act | `src/data/cbl.ts` |
| Rapport Investigate (onglet Investigate de `/cbl`) | `src/data/investigate.ts` · PDF dans `public/docs/` |
| Les images | `src/assets/images/` |
| Le modèle 3D, les fichiers audio | `public/models/`, `public/audio/` |
| Le texte d'une page | `src/pages/nom-de-la-page.astro` |
| Les couleurs et polices | `src/styles/global.css` |
| Les ressources d'origine (textes, slides…) | `ressources/` (non publié tel quel) |

---

## 3. Ajouter un article de blog

1. Dans `src/content/blog/`, **copiez** `_template.md` et renommez la copie, par ex. `week-02-journal.md`.
   - Le nom du fichier devient l'adresse : `/blog/week-02-journal`.
   - Pas d'espaces ni d'accents dans le nom : utilisez des tirets.
   - Les fichiers qui commencent par `_` sont ignorés (c'est le cas du modèle).
2. Remplissez l'en-tête entre les deux lignes `---` :

```yaml
---
title: "Learning without walls"
date: 2026-10-06
category: Project          # Project | Educate | Engage | Behind the Scenes | CBL | AI
tags: [avatars, vision]
cover: ../../assets/images/blog/learning-without-walls.jpg
coverAlt: "Une phrase qui décrit l'image"
excerpt: "Une ou deux phrases qui résument l'article."
---
```

3. Écrivez l'article en Markdown sous l'en-tête :

```markdown
## Un sous-titre

Du texte, du **gras**, de l'*italique*, un [lien](https://exemple.com).

- une liste
- à puces

> Une citation
```

4. **Image de couverture** : déposez-la dans `src/assets/images/blog/`. Le chemin dans `cover:` commence toujours par `../../assets/images/`. Pas d'image ? Supprimez les lignes `cover` et `coverAlt`.
5. **Brouillon** : ajoutez `draft: true` dans l'en-tête pour cacher l'article.

Le temps de lecture, le filtre par catégorie, la recherche et les liens « article précédent / suivant » sont automatiques.

> Des idées d'articles (issues de notre stratégie Instagram) sont listées dans `ressources/content/blog/_ideas.md`.

---

## 4. Ajouter un compte-rendu de réunion

1. Dans `src/content/meetings/`, copiez `_template.md` et renommez-le, par ex. `2026-10-06-kickoff-investigate.md`.
2. Remplissez l'en-tête :

```yaml
---
title: "Meeting #1 — Investigate kick-off"
date: 2026-10-06
type: supervisors      # team | supervisors | partner
attendees: [Med Rayen Ayat, Youssef Jouini, Mr. Safouane Jebali]
cbl_phase: Investigate # Engage | Investigate | Act
location: "ESPRIT"
summary: "Une phrase affichée sur la frise chronologique."
---
```

3. Gardez les 4 rubriques du modèle : `## Agenda`, `## Discussion`, `## Decisions`, `## Next steps`.
   Pour les tâches, `- [ ] Tâche — responsable — échéance` affiche une case à cocher, et `- [x]` une case cochée.

La réunion apparaît automatiquement sur la frise de `/meetings`, avec sa page détaillée.

---

## 5. Modifier un membre de l'équipe

Chaque membre a un fichier dans `src/content/team/` (ex. `youssef-jouini.md`) :

```yaml
---
name: "Youssef Jouini"
order: 2                 # position dans la grille
photo: ../../assets/images/team/youssef-jouini.jpg
role: "AI Engineer"
linkedin: "https://www.linkedin.com/in/..."
github: "https://github.com/..."
# email: "prenom.nom@esprit.tn"   (facultatif)
---
```

- Au départ, `role`, `linkedin` et `github` sont précédés d'un `#` (désactivés) : **retirez le `#`** et complétez-les.
- **Changer la photo** : remplacez le fichier dans `src/assets/images/team/` en gardant le même nom. Idéalement, une photo portrait d'au moins 600 px de large.
- **Ajouter un membre** : copiez un fichier existant, renommez-le et changez les valeurs.

---

## 6. Modifier les infos générales (email, vidéo, audio…)

Tout est dans **`src/data/site.ts`**. Une valeur `null` s'affiche comme un `[TODO]` sur le site.

```ts
email: 'fbais.team@esprit.tn',                       // au lieu de null
ctaVideoUrl: 'https://www.youtube.com/watch?v=XXXX',  // vidéo call to action (YouTube ou Google Drive)
demoVideoUrl: null,                                   // vidéo de démo de l'avatar, plus tard
audioClips: [
  { title: 'Socrates — on questions', src: '/audio/socrates.mp3' },
],
currentPhase: 'Investigate',                          // passez à 'Act' le moment venu
```

- **Vidéos** : un lien YouTube ou un lien de partage Google Drive (`https://drive.google.com/file/d/.../view`). La vidéo ne se charge qu'au clic du visiteur.
- **Audio** : déposez les `.mp3` dans `public/audio/`. Rien ne joue automatiquement.
- **Phrases liées aux ODD** : dans `src/pages/theme.astro`, en haut du fichier, remplacez `link: null` par une phrase entre guillemets.

---

## 7. Remplir la page AI & Methodology

Fichier : **`src/data/methodology.ts`**. Les listes vides s'affichent en `[TODO]`.

```ts
export const pipelineSteps: PipelineStep[] = [
  { title: 'Speech recognition', text: 'Turns the spoken question into text.', icon: 'mic', tech: 'Nom du modèle' },
  // … une ligne par étape, dans l'ordre
];

export const models = [{ name: '…', role: 'Language model', why: '…' }];
export const datasets = [{ name: '…', content: '…', size: '…', link: 'https://…' }];
export const metrics = [{ name: 'Word Error Rate', measures: '…', target: '< 10%', result: '8.2%' }];
```

Le schéma animé du pipeline se construit tout seul à partir de `pipelineSteps`.
Icônes possibles : `mic`, `brain`, `book`, `languages`, `volume`, `cube`, `cpu`, `chat`, `globe`, `sparkle`, `layers`.
Les métriques qui ont un `result` apparaissent aussi sur la page Results & Demo.

---

## 8. Mettre à jour la page CBL

Fichier : **`src/data/cbl.ts`**. Remplissez les listes de la phase Investigate (questions, activités, ressources, synthèse), puis celles de la phase Act (solution, implémentation, évaluation).
Pensez aussi à changer `currentPhase` dans `src/data/site.ts` : la barre de progression se met à jour sur toutes les pages.

---

## 9. Ajouter le modèle 3D de l'avatar (.glb)

1. **Compressez d'abord le fichier**, sinon il sera trop lourd :
   ```bash
   npx @gltf-transform/cli optimize avatar-original.glb avatar.glb --compress draco --texture-compress webp
   ```
   Visez moins de 5 Mo.
2. Placez-le exactement ici : **`public/models/avatar.glb`**.
3. Relancez `npm run dev`. Le viewer 3D interactif (rotation, zoom, éclairage) apparaît automatiquement sur **Results & Demo** et en aperçu sur la **Home**.

---

## 10. Mettre le site à jour en ligne

Une fois le site connecté à Vercel (section 11), **chaque `git push` met le site à jour** :

```bash
npm run build                 # 1. vérifier qu'il n'y a pas d'erreur
git add .                     # 2. préparer toutes les modifications
git commit -m "Add week 2 journal"   # 3. les enregistrer avec un message
git push                      # 4. les envoyer sur GitHub → Vercel publie en 1-2 min
```

Avec VS Code, vous pouvez aussi utiliser l'onglet **Source Control** (icône de branche à gauche) : écrivez un message, cliquez sur **Commit**, puis sur **Sync Changes**.

> Si le build échoue sur Vercel, l'ancienne version reste en ligne. Rien n'est cassé : lisez l'erreur dans l'onglet « Deployments » de Vercel, corrigez, puis poussez à nouveau.

---

## 11. Mise en ligne la première fois (GitHub + Vercel)

À faire **une seule fois**, par une personne de l'équipe.

### A. Mettre le projet sur GitHub

1. Créez un compte sur [github.com](https://github.com) si besoin.
2. Cliquez sur **New repository** : nom `knowledge-revolution-site`, **Public** ou **Private**, *sans* cocher « Add a README ».
3. Dans le terminal, dans le dossier du projet (le dépôt Git local est déjà initialisé, avec un premier commit) :
   ```bash
   git remote add origin https://github.com/VOTRE-COMPTE/knowledge-revolution-site.git
   git push -u origin main
   ```
4. Pour travailler à plusieurs : **Settings → Collaborators**, puis invitez les autres membres.

### B. Connecter GitHub à Vercel

1. Allez sur [vercel.com](https://vercel.com) → **Sign Up** → **Continue with GitHub**. Le plan gratuit « Hobby » suffit.
2. **Add New… → Project** → choisissez le dépôt `knowledge-revolution-site` → **Import**.
3. Vercel détecte Astro tout seul (le fichier `vercel.json` est déjà prêt). Ne changez rien et cliquez sur **Deploy**.
4. Après 1 à 2 minutes, vous obtenez un lien public permanent du type `https://knowledge-revolution-site.vercel.app`. C'est celui à envoyer aux professeurs.
5. **Important** : copiez ce lien dans `astro.config.mjs` (ligne `const SITE_URL = ...`). Il sert au partage sur les réseaux sociaux et au référencement. Puis faites un `git push`.
6. Facultatif : **Settings → Domains** permet de choisir un nom plus court (ex. `fbais-knowledge.vercel.app`) ou d'ajouter votre propre domaine.

---

## 12. Les [TODO] : repérer ce qui manque

Tout contenu manquant apparaît **sur le site** dans un badge doré en pointillés `✎ [TODO] …`.
Pour les lister dans le code :

```bash
git grep -n "TODO"
```

---

## 13. En cas de problème

| Problème | Solution |
|---|---|
| `npm` n'est pas reconnu | Installez Node.js, puis fermez et rouvrez le terminal. |
| Erreur `... does not match the schema` | Une valeur de l'en-tête est invalide : date au format `AAAA-MM-JJ`, catégorie parmi la liste, lien commençant par `https://`. |
| `Could not find requested image` | Le chemin de l'image est faux. Vérifiez le nom exact du fichier (majuscules comprises) et le début `../../assets/images/`. |
| La page ne se met pas à jour | Arrêtez `npm run dev` (`Ctrl + C`) puis relancez-le. |
| Tout semble cassé après un `git pull` | Relancez `npm install`. |

---

### Technique (pour les curieux)

- [Astro 7](https://astro.build) (site statique) · [Tailwind CSS 4](https://tailwindcss.com) · React (uniquement pour les parties interactives)
- 3D : [three.js](https://threejs.org) + React Three Fiber + drei. La scène du hero est générée en code (particules). Elle ne se charge qu'après la page, et seulement sur les écrans larges et les appareils capables. Sur mobile, une image statique la remplace.
- Animations : GSAP. Tout respecte le réglage système « réduire les animations ».
- Polices auto-hébergées dans `public/fonts/` (Playfair Display, Montserrat, Open Sans, Lora).
- Palette (`ressources/design/brand.md`) : navy `#101B40`, or `#E8A93A`, cyan `#5CE1E6`, corail `#FF9A5C`, crème `#EFE6D6`.
