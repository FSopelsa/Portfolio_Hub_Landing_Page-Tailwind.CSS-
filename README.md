# TailwindCSS Workshop - A Portfolio Hub

A first version of my personal project hub. Start with `index.html`: the landing page is plain HTML styled with Tailwind utilities. The original workshop brief is in `TailwindCSS-Workshop.md`.

## Open and edit

From this folder:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Open <http://127.0.0.1:5173>. A local server is required for the interactive model gallery's JavaScript modules and GLB files. The landing page uses Tailwind's v4 Play CDN, so it needs an internet connection for styling. Tailwind documents the Play CDN as development-only: <https://tailwindcss.com/docs/installation/play-cdn>. Compile the CSS before publishing.

The page has an introduction, an asset showcase, a workflow guide, six project cards, an about section, and GitHub links. Edit the copy and utility classes directly in `index.html`. Comments mark the main places to customize. No framework or package install is needed; the homepage's only script loads Tailwind.

## Assets showcase

The feature is an **AI-assisted asset generation showcase**, with a documented production process. It is the foundation of a tool that can help creators go from idea to an actual 3D asset, test-able in game, as quickly as possible - while saving as much as possible on LLM tokens. [WORKFLOW.md](WORKFLOW.md) contains the detailed guide, exact saved skill names, software versions, original image prompt, preserved rebuild commands, and explicitly labelled reconstructed LLM briefs.

The page states the main purpose first: quickly turn just a photo or description into an actual 3D object for viewing, placement, and testing inside a game engine. Secondary goals are similar quality with fewer tokens and lower spending, plus a separate physical-prop export path. These are development goals; measured savings and print readiness have not been demonstrated.

The skills section now names `three-webgl-game`, whose read was verified in a previous Sundown development session, alongside the Foundry pack's documented `web-3d-asset-pipeline`. The scope of each record is stated so the game-runtime skill is not mistakenly attributed to the Foundry skill lock.

## Asset sources

- `assets/cinder-foundry.png`: final exported GLB showcase render.
- `assets/foundry-concept.png`: generated visual reference, labelled as such on the page.
- `assets/foundry-turntable.mp4`: final GLB turntable.
- `assets/asset-notes.md`: original asset production and software provenance notes.
- `assets/concept-prompt.txt`, `skill-lock.json`, `art-direction.md`, `technical.md`, `original-qa.md`: original prompt, skill identities, and production evidence. QA dates describe historical checks.
- `showcase/`: existing interactive gallery, required modules, integration helper, and six embedded-texture GLBs.

This is a local workshop version. The PNGs and models retain their existing resolution; optimize delivery after choosing the final imagery. The interactive gallery requires WebGL.
