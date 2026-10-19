# TailwindCSS Workshop - A Portfolio Hub

A first version of my personal project hub. Start with `index.html`: the landing page is plain HTML styled with Tailwind utilities. The original workshop brief is in `TailwindCSS-Workshop.md`.

## Open and edit

The compiled stylesheet and optimized assets are included, so viewing the site only needs a local server. From this folder:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Open <http://127.0.0.1:5173>. A local server is required for the interactive gallery and browser trial. The stylesheet, images, JavaScript modules, and models are served locally; the site needs no CDN or runtime CSS compiler.

The page has an introduction, one featured Cinder Foundry and Workshop case study, six selected project cards, an about section, and GitHub links. The full asset workflow and local Blender setup stay in `WORKFLOW.md`; the main page keeps the feature compact beside the other projects. Edit the copy and utility classes directly in `index.html`, and the theme and base styles in `styles/input.css`. Comments mark the main places to customize. The homepage runs without JavaScript.

After changing Tailwind classes or source styles, rebuild the checked-in `assets/site.css` with Node.js and npm:

```powershell
npm.cmd ci
npm.cmd run build
```

Use `npm.cmd run watch` while editing to rebuild automatically. Tailwind scans only `index.html`; the model gallery retains its existing standalone stylesheet. Build dependencies are pinned in `package-lock.json` and are unnecessary when serving the finished site.

Run `npm.cmd run build:site` to refresh the stylesheet and prepare the static site in `dist/` for deployment. The browser generator runs on each visitor's device; the hosted site needs no model API or generation server.

## Web delivery optimization

The two original PNGs were replaced with WebP images at widths suited to the page, with smaller `srcset` variants for phones. Two Cinder Workshop UI captures were added as JPEGs. The six original Foundry GLBs use lossless WebP compression for their embedded textures at the original texture resolutions. Geometry, hierarchy, sockets, animations, and decoded texture pixels are preserved. The gallery now also carries two optimized Siege character exports; its local Three.js loader uses the Meshopt decoder for these game builds.

| Files | Original bytes | Delivered bytes | Reduction |
| --- | ---: | ---: | ---: |
| Page images (including screenshots and responsive variants) | 8,325,143 | 675,417 | 91.9% |
| Six original Foundry GLBs | 26,410,872 | 19,191,848 | 27.3% |
| Combined | 34,736,015 | 19,867,265 | 42.8% |

The minified local stylesheet is 20,439 bytes. These figures describe file sizes, not a measured connection speed or frame-rate improvement. Model compression reduces downloads; texture resolution, triangle counts, and GPU memory use are unchanged. The turntable video retains its original encoding and loads on demand.

To regenerate the optimized assets, pass the original Cinder Foundry `outputs` folder (containing `renders/`, `concept/`, and `models/`):

```powershell
npm.cmd run optimize:assets -- "C:\Users\F\Downloads\make-the-best-looking-3d-blender-2\outputs"
```

The optimizer reads the original delivery and writes this portfolio's WebP images and GLBs. It checks geometry and animation data, node transforms and hierarchy, material names, decoded texture pixels, file-size reduction, and glTF validation before replacing each model. Use the original pack as input to avoid repeated image quality loss. Detailed measurements and validation results are in `assets/optimization-report.json`.

## Assets showcase

The page presents the **AI-assisted Cinder Foundry asset process** and two ways to try **Cinder Workshop**. Its gallery now includes the updated Clampwright engineer and Blue Humanoid character placed in Sundown's Siege environment. The browser trial builds a simplified tower mesh on the visitor's device, previews it, and exports a GLB, with two builds stored per browser. It makes no server or model calls. The full local prototype uses Blender and adds project history, checks, review, and editable `.blend` downloads. Its photo and regional notes are context only; photo/description interpretation, token tracking, and print export have not been implemented. [WORKFLOW.md](WORKFLOW.md) explains both paths and their limits.

The development goal is to quickly turn a photo or description into an actual 3D object for viewing, placement, and testing inside a game engine. Both current paths still use manual controls; neither interprets the photo or description. The browser trial creates a lightweight GLB in the visitor's browser. The full local app runs the Blender recipe and can also download editable `.blend` source. Reusable instructions aim to reduce future token use and spending, but savings have not been measured. Print export is also future work.

The skills section now names `three-webgl-game`, whose read was verified in a previous Sundown development session, alongside the Foundry pack's documented `web-3d-asset-pipeline`. The scope of each record is stated so the game-runtime skill is not mistakenly attributed to the Foundry skill lock.

## Asset sources

- `assets/cinder-foundry.webp`, `cinder-foundry-800.webp`: optimized final exported GLB showcase render.
- `assets/foundry-concept.webp`, `foundry-concept-768.webp`: optimized generated visual reference, labelled as such on the page.
- `assets/foundry-turntable.mp4`: final GLB turntable.
- `assets/cinder-workshop-build.jpg`, `assets/cinder-workshop-reference.jpg`: captures from the local workbench showing build/review and photo-reference features.
- `assets/cinder-workshop-local.zip`: clean source download for the full local Blender workbench; it excludes project data, personal references, logs, and test outputs.
- `assets/asset-notes.md`: original asset production and software provenance notes.
- `assets/concept-prompt.txt`, `skill-lock.json`, `art-direction.md`, `technical.md`, `original-qa.md`: original prompt, skill identities, and production evidence. QA dates describe historical checks.
- `showcase/`: existing interactive gallery, required modules, integration helper, and six embedded-texture GLBs.
- `showcase/workshop-demo/`: limited browser trial with client-side GLB generation.

The original Foundry source delivery remains separate from these optimized portfolio files. The interactive gallery and browser workshop trial require WebGL; the gallery also uses WebP support.

## Checks for this delivery

On 15 October 2026, the CSS build and watch startup succeeded, and npm's dependency audit reported zero vulnerabilities. The asset optimizer compared all model accessor data, node hierarchy and transforms, animation targets, and decoded texture pixels against the original files; all six original Foundry GLBs passed Khronos validation with zero errors and warnings.

On 16 October 2026, the Cinder Workshop project section and its two captured screens were added, and `npm.cmd run build` regenerated the stylesheet. The separate local Cinder Workshop app was not started as part of this portfolio edit.

On 19 October 2026, the gallery loaded both new game exports, and the Clampwright and Blue Humanoid entries rendered with their recorded 18,608 and 67,342 triangle counts. The Clampwright detail view was visually checked in the browser. The full game and its Siege scene were not rerun in this portfolio update.
