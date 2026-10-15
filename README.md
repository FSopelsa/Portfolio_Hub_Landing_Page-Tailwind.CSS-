# TailwindCSS Workshop - A Portfolio Hub

A first version of my personal project hub. Start with `index.html`: the landing page is plain HTML styled with Tailwind utilities. The original workshop brief is in `TailwindCSS-Workshop.md`.

## Open and edit

The compiled stylesheet and optimized assets are included, so viewing the site only needs a local server. From this folder:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Open <http://127.0.0.1:5173>. A local server is required for the interactive model gallery's JavaScript modules and GLB files. The stylesheet, images, gallery modules, and models are served locally; the site needs no CDN or runtime CSS compiler.

The page has an introduction, an asset showcase, a workflow guide, six project cards, an about section, and GitHub links. Edit the copy and utility classes directly in `index.html`, and the theme and base styles in `styles/input.css`. Comments mark the main places to customize. The homepage runs without JavaScript.

After changing Tailwind classes or source styles, rebuild the checked-in `assets/site.css` with Node.js and npm:

```powershell
npm.cmd ci
npm.cmd run build
```

Use `npm.cmd run watch` while editing to rebuild automatically. Tailwind scans only `index.html`; the model gallery retains its existing standalone stylesheet. Build dependencies are pinned in `package-lock.json` and are unnecessary when serving the finished site.

## Web delivery optimization

The two original PNGs were replaced with WebP images at widths suited to the page, with smaller `srcset` variants for phones. All six GLBs use lossless WebP compression for their embedded textures at the original texture resolutions. Geometry, hierarchy, sockets, animations, and decoded texture pixels are preserved. The existing Three.js loader supports `EXT_texture_webp`; no additional decoder is needed.

| Files | Original bytes | Delivered bytes | Reduction |
| --- | ---: | ---: | ---: |
| Page images (including all four responsive variants) | 8,032,936 | 383,210 | 95.2% |
| Six GLBs | 26,410,872 | 19,191,848 | 27.3% |
| Combined | 34,443,808 | 19,575,058 | 43.2% |

The minified local stylesheet is 19,448 bytes. These figures describe file sizes, not a measured connection speed or frame-rate improvement. Model compression reduces downloads; texture resolution, triangle counts, and GPU memory use are unchanged. The turntable video retains its original encoding and loads on demand.

To regenerate the optimized assets, pass the original Cinder Foundry `outputs` folder (containing `renders/`, `concept/`, and `models/`):

```powershell
npm.cmd run optimize:assets -- "C:\Users\F\Downloads\make-the-best-looking-3d-blender-2\outputs"
```

The optimizer reads the original delivery and writes this portfolio's WebP images and GLBs. It checks geometry and animation data, node transforms and hierarchy, material names, decoded texture pixels, file-size reduction, and glTF validation before replacing each model. Use the original pack as input to avoid repeated image quality loss. Detailed measurements and validation results are in `assets/optimization-report.json`.

## Assets showcase

The feature is an **AI-assisted asset generation showcase**, with a documented production process. It is the foundation of a tool that can help creators go from idea to an actual 3D asset, test-able in game, as quickly as possible - while saving as much as possible on LLM tokens. [WORKFLOW.md](WORKFLOW.md) contains the detailed guide, exact saved skill names, software versions, original image prompt, preserved rebuild commands, and explicitly labelled reconstructed LLM briefs.

The page states the main purpose first: quickly turn just a photo or description into an actual 3D object for viewing, placement, and testing inside a game engine. Secondary goals are similar quality with fewer tokens and lower spending, plus a separate physical-prop export path. These are development goals; measured savings and print readiness have not been demonstrated.

The skills section now names `three-webgl-game`, whose read was verified in a previous Sundown development session, alongside the Foundry pack's documented `web-3d-asset-pipeline`. The scope of each record is stated so the game-runtime skill is not mistakenly attributed to the Foundry skill lock.

## Asset sources

- `assets/cinder-foundry.webp`, `cinder-foundry-800.webp`: optimized final exported GLB showcase render.
- `assets/foundry-concept.webp`, `foundry-concept-768.webp`: optimized generated visual reference, labelled as such on the page.
- `assets/foundry-turntable.mp4`: final GLB turntable.
- `assets/asset-notes.md`: original asset production and software provenance notes.
- `assets/concept-prompt.txt`, `skill-lock.json`, `art-direction.md`, `technical.md`, `original-qa.md`: original prompt, skill identities, and production evidence. QA dates describe historical checks.
- `showcase/`: existing interactive gallery, required modules, integration helper, and six embedded-texture GLBs.

The original source delivery remains separate from these optimized portfolio files. The interactive gallery requires WebGL and WebP support.

## Checks for this delivery

On 15 October 2026, the CSS build and watch startup succeeded, and npm's dependency audit reported zero vulnerabilities. The asset optimizer compared all model accessor data, node hierarchy and transforms, animation targets, and decoded texture pixels against the original files; all six GLBs passed Khronos validation with zero errors and warnings.

The compiled page was inspected in the Codex browser at its default desktop viewport and at 390 × 844. The local stylesheet and WebP images loaded, the homepage contained no scripts, all local page links and anchors resolved, and the phone layout had no horizontal overflow. The gallery rendered all four assets at LOD 1 and loaded the detail towers at LOD 0, reporting the original 32,751 and 88,060 ensemble triangle counts. No fatal browser errors appeared; the graphics driver retained its existing shader precision warning. These are local browser checks, not a network-speed benchmark or a full browser compatibility survey.
