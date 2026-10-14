# Portfolio hub workshop

A first version of my personal project hub. Start with `index.html`: the landing page is plain HTML styled with Tailwind utilities. The original workshop brief is in `TailwindCSS-Workshop.md`.

## Open and edit

From this folder:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Open <http://127.0.0.1:5173>. A local server is required for the interactive model gallery's JavaScript modules and GLB files. The landing page uses Tailwind's v4 Play CDN, so it needs an internet connection for styling. Tailwind documents the Play CDN as development-only: <https://tailwindcss.com/docs/installation/play-cdn>. Compile the CSS before publishing.

The page has an introduction, an asset showcase, a workflow guide, seven project cards, an about section, and GitHub links. Edit the copy and utility classes directly in `index.html`. Comments mark the main places to customize. No framework or package install is needed; the homepage's only script loads Tailwind.

## How the assets are presented

The feature is an **AI-assisted asset showcase**, with a documented production process. [WORKFLOW.md](WORKFLOW.md) contains the detailed guide, exact saved skill names, software versions, original image prompt, preserved rebuild commands, and explicitly labelled reconstructed LLM briefs. The site does not present these scripts as a personally authored general image-to-3D generator.

The page states the main purpose first: quickly turn just a photo or description into an actual 3D object for viewing, placement, and testing inside a game engine. Secondary goals are similar quality with fewer tokens and lower spending, plus a separate physical-prop export path. These are development goals; measured savings and print readiness have not been demonstrated. The guide proposes a small personal app, **Cinder Workshop**, built around reusable recipes, saved asset projects, separate game/print outputs, and usage per accepted asset.

The skills section now names `three-webgl-game`, whose read was verified in a previous Sundown development session, alongside the Foundry pack's documented `web-3d-asset-pipeline`. The scope of each record is stated so the game-runtime skill is not mistakenly attributed to the Foundry skill lock.

The strongest presentation is a short case study visitors can understand in order:

1. **Purpose:** create usable assets for Sundown at Cinder Junction.
2. **Visual starting point:** a clearly labelled concept reference.
3. **Real output:** a turntable rendered from the final exported GLBs.
4. **Inspect the result:** open the existing interactive gallery to orbit, switch models, inspect wireframes, compare detail levels, and play motion.
5. **Explain the process:** describe the actual skills, concept generation, LLM-assisted procedural authoring, GLB preparation, and integration. If you add a recording later, show one actual build from script execution to model import. Keep attribution and your own contribution accurate.

The concept image is a generated design reference. The model still and turntable show actual exported geometry. The gallery is a separate page, so models load only when someone chooses to explore them. It starts with battlefield LODs to reduce the initial download. It reuses the delivered Cinder Foundry viewer and its local Three.js dependencies; the MIT license is retained. The viewer is intended for desktop mouse/keyboard use.

The copy that describes game use is based on Sundown's current local `docs/3d/cinder-foundry/README.md` and `src/game/assets/manifest.js`. The model totals come from the delivered Foundry README: 88,060 triangles at detail level, 32,751 at battlefield level. These figures describe this asset pack; they are not generator performance benchmarks or a measured frame rate.

Sundown's GitHub repository is currently private, so the landing page links to the working local gallery. The production process and recorded instructions can be read on the page or in the guide without access to the repository. No credentials or generation API are needed by this portfolio.

## Project selection

Reviewed against the current GitHub repositories on 14 October 2026. These are portfolio choices, not a full code audit or a claim that all applications were run successfully.

| Project | What it adds to the portfolio | Useful evidence to add next |
| --- | --- | --- |
| [Artists / Orgnsort](https://github.com/FSopelsa/orgnsort) | A personal product with TypeScript/React, library grouping, lazy loading, and caching. Its deterministic fixture preview makes a future demonstration practical. | A short browsing recording from the fixture preview or current Spotify client; label which one it is. |
| [Car Rental](https://github.com/FSopelsa/Car-Rental) | React, a Java/Spring API, PostgreSQL, and concrete booking rules. The inspected service validates booking input and checks overlaps. | One booking flow and its validation outcome, plus a small UI-to-service-to-database diagram. |
| [NodeQuiz](https://github.com/FSopelsa/NodeQuiz) | Vue, Express, MongoDB, quiz codes, sessions, and saved participant results. | A recording from creating a quiz through joining and viewing results. Treat its Google sign-in as unverified; the inspected code mixes sign-in APIs. |
| [TurtleData](https://github.com/FSopelsa/TurtleData) | An early Lua addon prototype: slash commands, a search window, and item-ID tooltip hooks. | A genuine in-game capture of the implemented commands and tooltip behavior. The loaded `TurtleData.lua` has a TODO for database search, so the card explicitly labels it a prototype. |
| [Poklone](https://github.com/FSopelsa/Poklone) | A Java creature-battling prototype with Swing/terminal adapters, shared battle rules, and exploration/battle transitions. | A recording of a room encounter, battle, and catch attempt. The repository README describes current behavior; this portfolio update did not run the game. |
| [Dice & Clock](https://github.com/FSopelsa/Dice-Clock-OOP) | Prototype-based JavaScript, dynamic DOM construction, draggable application windows, dice, and a live clock. | A recording opening and using both windows. The card is grounded in `Dicegame/index.html`, `Main.js`, `DiceApp.js`, and `Clock.js`. |
| [Ett litet spel](https://github.com/FSopelsa/Ett-litet-spel) | A 4 × 4 number-placement puzzle with drag-and-drop interaction, increasing-sequence scoring, and locally stored totals. | A completed board and a reload showing stored results. The card is grounded in `EttLitetSpel.html` and `js/localStorage.js`. |

Other candidates:

- **SpiceCloud:** visually interesting API and playback integration. Its README references another clone owner (`5djr/SpiceCloud`), so confirm your contribution and attribution before presenting it as original work. The inspected README describes session-token-based access and external client dependencies; current playback was not verified.
- **Shipping Documents:** a useful automation idea, but the inspected `woocommerce-shipping-docs.php` contains placeholder credentials and a stubbed Google Drive uploader returning an example URL. Present it as a prototype until the real integration exists.
- **Subscription Platform:** potentially useful for recent Spring work, but currently private. Prepare an approved excerpt or recording before using a public code CTA.

GitHub copy was grounded in repository READMEs plus `CarRentalService.java`, NodeQuiz's `gameSessionRoutes.js` and `QuizPage.vue`, TurtleData's loaded `TurtleData.lua` and manifest, and `woocommerce-shipping-docs.php`. Descriptions focus on behavior visible in those sources and do not claim production readiness.

## Asset sources

Copied from the user's existing Cinder Foundry delivery under `C:\Users\F\Downloads\make-the-best-looking-3d-blender-2\outputs`, which corresponds to the Foundry source pack preserved in Sundown. No new stock imagery, model downloads, generated art, or external generation requests were used.

- `assets/cinder-foundry.png`: final exported GLB showcase render.
- `assets/foundry-concept.png`: generated visual reference, labelled as such on the page.
- `assets/foundry-turntable.mp4`: final GLB turntable.
- `assets/asset-notes.md`: original asset production and software provenance notes.
- `assets/concept-prompt.txt`, `skill-lock.json`, `art-direction.md`, `technical.md`, `original-qa.md`: original prompt, skill identities, and production evidence. QA dates describe historical checks.
- `showcase/`: existing interactive gallery, required modules, integration helper, and six embedded-texture GLBs.

This is a local workshop version. The PNGs and models retain their existing resolution; optimize delivery after choosing the final imagery. The interactive gallery requires WebGL.

## Checks performed for this version

On 14 October 2026, the landing page was inspected in the Codex browser at its default desktop viewport and at 390 × 844. The phone layout and expanded instruction block had no horizontal overflow. Both images loaded, section navigation and the gallery return link worked, and the turntable played with an 8-second duration and no media error.

The gallery visibly rendered all four objects, reported 32,751 triangles at LOD 1 and 88,060 at LOD 0, and responded to model selection, wireframe, and motion pause controls. No fatal browser errors were observed; the graphics driver emitted a non-blocking shader precision warning. A small filesystem check confirmed every landing-page local asset/file link and section target existed. `portfolio-preview.jpg`, `mobile-preview.jpg`, and `gallery-preview.jpg` preserve representative browser views.

The other featured applications were reviewed from GitHub source and documentation; they were not started or tested. The original Blender production and historical QA records were not rerun.
