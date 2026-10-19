# How the Cinder Foundry assets were made

This is an AI-assisted asset production case study for **Sundown at Cinder Junction**. It presents the assets and the recorded production process. The preserved scripts are procedural authoring tools.

The interactive gallery covers six game assets: **Ember Reliquary**, **Wayfarer Condenser**, **Frontier Cell Cache**, **Junction Paving**, **Clampwright**, and **Blue Humanoid**. The original Foundry production record covers the first four; the two character entries document later additions to the Siege environment. The towers each have detail and battlefield exports.

Clampwright is a reference-led workshop engineer with an animated idle pose. Blue Humanoid is a seated decorative character with a gentle crown animation. Both are displayed from the game's optimized GLB exports; the gallery uses Meshopt decoding for these files. Sundown's records describe the user-supplied Blue Humanoid as their own asset, but do not independently certify its licence. Clampwright's source notes also say the underlying toy design rights were not supplied.

## The goal of the methodology

The **main purpose** is to quickly turn **just a photo or written description into an actual 3D object that can be viewed, placed, and tested inside a game engine**. The aim is a short, repeatable journey from an idea to usable geometry, with an engine-compatible export as the primary result.

The longer-term goal is to preserve similar visual quality while progressively reducing LLM tokens and spending through a streamlined methodology. A separately prepared print export would also allow the objects to become physical props made with a 3D printer.

The proposed efficiency improvements are reusable geometry/material recipes, shorter structured briefs, saved style decisions, local deterministic checks, and focused revisions to the part that needs changing. Token reduction and lower costs are objectives to measure, not savings already demonstrated by the current asset pack. No generation-token telemetry or cost comparison is preserved with these assets.

A photograph can establish visual direction and approximate proportions. A single photo does not establish exact dimensions or reveal hidden surfaces; the app should make estimated scale and inferred shapes visible, with optional known measurements for better accuracy. The existing collection includes photograph-guided asset work, but a generalized automated photo-input app has not been built here.

## What is known, and what is reconstructed

The original pack preserves an image prompt, skill lock, art direction, source scripts, Blender scenes, exported models, technical handoff, validation reports, renders, and a browser gallery. Those are the basis of this guide.

- **Preserved:** the exact [concept-image prompt](assets/concept-prompt.txt), the [skill lock](assets/skill-lock.json), and the production/rebuild records below.
- **Documented:** the guidance used, the local Blender authoring route, dependencies, and asset checks.
- **Reconstructed:** the suggested LLM authoring briefs in this guide. They are instructions for repeating the process, not quotes from the original conversation.
- **Unrecorded:** the exact authoring LLM/model, its reasoning settings, the full conversation, and the precise sequence of intermediate prompts. No model name is inferred from the current chat or installed plugins.

The portfolio wording should credit AI assistance and describe Felix's confirmed role in selecting, directing, evaluating, or integrating the result. The pack alone does not establish who personally typed each line of code or made every design decision.

## Recorded skills, plugins, and software

| Item | Recorded role / evidence |
| --- | --- |
| `find-skills` | Skill discovery, named in the original art-direction notes. |
| `imagegen` + built-in ImageGen | Concept-image guidance and generation. The exact image prompt was saved. |
| `web-3d-asset-pipeline` | Browser asset pipeline guidance, named in the original art-direction notes; prepares assets for a Three.js runtime. |
| `game-studio:three-webgl-game` | Three.js scene, camera, loader, render-loop, and simulation-boundary guidance. A successful historical read is preserved in the earlier Sundown development conversation. This confirms use in the broader game work; it is not an additional entry in the Foundry production lock. |
| `blender-modeling` | Mesh and modifier guidance; installed from `roble3/cc-blender-skill`. |
| `blender-materials` | Procedural material guidance; same skill source. |
| `blender-lighting` | Lighting and presentation guidance; same skill source. |
| `blender-export` | Export and portability guidance; same skill source. |
| Blender 4.5.3 LTS | Local execution of Python authoring, baking, export, and rendering scripts. |
| Python + Pillow 12.3.0 | Texture processing and LOD preparation. |
| glTF Transform 4.5.1 | GLB optimization and resource processing. |
| MikkTSpace 1.1.1 | Tangent reconstruction after mesh changes. |
| Khronos glTF Validator 2.0.0-dev.3.10 | Final-file validation, with saved per-file reports. |
| Three.js 0.185.0 / WebGL | Interactive preview and integration helper. |
| Tripo / Gemini workflows | Inspected, according to provenance; the final meshes were authored locally in Blender. The art-direction notes say the Tripo credential probe reported missing credentials. |

The four Blender skill paths and content hashes are preserved in [skill-lock.json](assets/skill-lock.json). Their source is [RobLe3/cc-blender-skill](https://github.com/RobLe3/cc-blender-skill).

These skills are instruction packages. The recorded execution path uses local Blender Python scripts. The pack does not contain a complete MCP/plugin invocation trace, so this guide does not claim that a particular Blender MCP connection or plugin version performed the production run. Blender MCP is mentioned in Sundown's separate reference-led asset collection notes; that is a different production record.

## 1. Define a visual brief and a runtime contract

The art direction combines serviceable frontier machinery with tall, ceremonial shapes: ceramic fins, cast iron, sandstone, copper, hoses, pressure gauges, and original vertical glyphs. Amber identifies the defense tower; cyan identifies the support structure. Silhouettes should remain readable from the elevated game camera.

The technical contract sets meters as authoring units, ground-centered roots, GLB Y-up exports, named moving parts, PBR textures, attachment sockets, and idle/activation clips. Gameplay rules remain in the JavaScript simulation.

Suggested LLM instruction — **reconstructed**:

```text
Create four original game assets for Sundown at Cinder Junction:
an elemental defense tower, a support tower, a supply cache,
and a modular paving tile.

Use serviceable frontier machinery, warm ceramic/copper/iron
materials, original decorative glyphs, distinct amber and cyan
energy cores, and silhouettes readable from an elevated camera.

Set a runtime contract before modeling: editable Blender source,
self-contained GLB, meter scale, ground-centered roots, named
parts and sockets, baked PBR maps, and transform animation clips.
Document sources, actual tool use, and known limitations.
```

## 2. Create a concept reference

The built-in ImageGen tool produced a landscape concept showing the two towers. Its saved prompt explicitly describes the geometry, materials, camera, and lighting. It calls for original designs and calligraphy, with no franchise logos, watermark, or annotations.

Read the [original image prompt](assets/concept-prompt.txt). That is the actual preserved prompt; it is more specific than the short reusable briefs in this guide.

The concept image is a visual target. It is not a screenshot of a mesh, and the production route does not automatically reconstruct its pixels into geometry.

## 3. Author editable geometry in Blender Python

The saved skills guide the construction and presentation work. `source/build_assets.py` creates the scene, shapes, decorative forms, procedural materials, and named parts. It uses deterministic construction, with `random.seed(271828)` visible in the source. `source/export_assets.py` prepares exports and bakes material maps.

Suggested LLM instruction — **reconstructed**:

```text
Read the modeling, materials, lighting, and export skills.
Use the concept as visual direction and author original geometry
with reproducible Blender Python scripts.

Keep the major shapes readable from above. Give moving parts and
attachment nodes semantic names. Preserve an editable source scene.
Use procedural material recipes and bake the maps needed by GLB.
Keep preview cameras, lights, and studio scenery out of asset exports.
```

## 4. Prepare textures, LODs, and animations

The delivered pack includes base color, normal, roughness, metallic, and packed ORM maps. Tower detail and battlefield versions reduce both geometry and texture resolution.

`texture_lods.py` prepares texture variants. `optimize.mjs` removes degenerate geometry, reconstructs MikkTSpace tangents, deduplicates resources, adds activation clips, writes optimized GLBs, and records validation results. The assets use transform animation on named pivots: `Idle` and `Fire` for Ember; `Idle` and `Pulse` for the condenser.

Suggested LLM instruction — **reconstructed**:

```text
Export detailed and battlefield versions of the towers.
Embed PBR textures in the GLBs, preserve named pivots and sockets,
and include Idle plus Fire/Pulse transform animation clips.

Reduce redundant geometry and resources. Rebuild tangents after
mesh changes. Measure final counts from the exported binaries,
and document texture sizes, file sizes, and scale.
```

The delivered collection totals **88,060 triangles** at detail level or **32,751** at battlefield level. These are asset counts, not a frame-rate benchmark.

## 5. Validate and present the final exports

The saved QA record is dated **29 September 2026**. It records validation of all six GLBs, finite bounds, attachment nodes, animation clips, binary counts, byte-for-byte reproduction of optimized output, and visual inspection. Those are historical recorded checks; this portfolio task did not rerun Blender production or all of those validations.

The stills and turntable were rendered by importing the final GLBs. The Three.js gallery uses those exports and the supplied integration helper. This is why the portfolio shows three different kinds of evidence with distinct labels: concept reference, exported model video, and interactive runtime gallery.

For portfolio delivery on 15 October 2026, the page images were resized and converted to WebP, and the GLBs' embedded textures were converted to lossless WebP at their original resolutions. The mesh and animation data, hierarchy, sockets, and decoded texture pixels were checked against the original delivery; all six optimized GLBs passed validation with zero errors and warnings. The [delivery report](assets/optimization-report.json) records sizes and results. The historical production records below continue to describe the original pack.

Suggested LLM instruction — **reconstructed**:

```text
Validate every final GLB and save the results. Independently check
finite bounds, ground placement, attachment nodes, and animation clips.

Render the final exported GLBs rather than an intermediate scene.
Produce a short turntable and a browser gallery with model selection,
camera controls, wireframe, detail switching, and animation controls.
Record what was actually checked and what remains unverified.
```

## 6. Integrate into Sundown

The later local Sundown integration preserves the source pack and prepares runtime models at navigation-cell scale. `scripts/prepare-cinder-foundry.mjs` writes stable roots and an integration report. Runtime paths are registered in `src/game/assets/manifest.js`; the loader caches shared geometry/materials and animation remains in the presentation layer.

The local integration notes map Ember to Sunspitter and the Ash Foundry landmark; the condenser to Tesla Coil and the Mender relay; the cache to supplies and perimeter props; and paving to fortification pads. Fire/Pulse animation follows game events.

Suggested LLM instruction — **reconstructed**:

```text
Inspect the existing game simulation, asset manifest, loader, and
presentation layer before integrating these GLBs.

Prepare stable ground-centered roots at game scale. Register paths
centrally and reuse the existing model cache. Connect visual clips
and sockets to simulation events. Preserve movement, targeting,
damage, objectives, and save behavior in the simulation.

Check model validity and exercise the actual desktop game scenes.
```

## Original rebuild sequence

This sequence is copied from the delivered technical handoff. Run it from a **working copy of the original asset pack**, where `source/` and the Blender files exist. Rebuilding overwrites generated output. These build scripts are not included in this lightweight portfolio folder.

The recorded setup used Blender 4.5.3 LTS, Node 24.15, Python 3.14, and Pillow 12.3.0. The baking/render scripts select NVIDIA OptiX; another GPU or CPU needs a corresponding device setting. Package dependencies are pinned in the original source lock files.

```text
blender --background --factory-startup --python source/build_assets.py
blender --background --factory-startup --python source/export_assets.py
python -m pip install -r source/requirements.txt
python source/texture_lods.py
npm ci --prefix source --ignore-scripts
node source/optimize.mjs
node source/verify_assets.mjs
blender --background --factory-startup --python source/sync_runtime_blends.py
blender --background --factory-startup --python source/render_showcase.py
blender --background --factory-startup --python source/render_showcase.py -- --video
```

These are preserved commands for the recorded setup, not a claim of compatibility with later Blender/package releases.

## From digital asset to a physical prop

The model geometry can also be prepared for physical production. A typical route is **Blender source → print preparation → STL or another slicer-supported mesh format → slicer → printer toolpaths → 3D printer**. The slicer determines the settings and toolpaths for the chosen printer and material.

Prepare a separate print variant: set its real-world size, make the parts solid/watertight, resolve disconnected or intersecting components, check minimum thickness and fragile details, and choose an orientation or part split suitable for supports. The current game GLBs and screenshots do not prove that a printed version will succeed. Blender's [3D Print Toolbox](https://extensions.blender.org/add-ons/print3d-toolbox/) can help inspect geometry; Prusa's [modeling guidance](https://help.prusa3d.com/article/modeling-with-3d-printing-in-mind_164135) explains the need for solid geometry and print-aware design.

Three.js also provides an [STLExporter](https://threejs.org/docs/#STLExporter), making a future browser export feature practical. STL carries surface geometry, with arbitrary units and no color or texture information. Export should therefore explicitly set the intended size; the PBR maps, glowing cores, and animation seen in the gallery are not reproduced by an ordinary STL print. Details that must appear physically need to exist in the geometry, and color can be handled by materials, painting, or a suitable multi-material process.

No printable export, mesh repair, slicer review, or physical print was performed for this portfolio update. Print preparation is an additional output path for the methodology.

## Cinder Workshop: browser trial and full local workflow

### Browser trial

Open the [two-build browser demo](showcase/workshop-demo/). It runs a simplified Cinder Tower recipe in the visitor's browser, previews the generated mesh, and downloads a self-contained GLB for game-engine use. It needs no account, Blender install, or running home service. The two-build limit is stored in browser storage; clearing site data resets it. Builds are temporary and stay on the visitor's device.

This is a lightweight browser port of the manual tower controls. It does not call an image model, interpret a photo or written description, save projects to a server, or create Blender source. A selected photo stays in the browser and is reference only. Browser output is a useful game-mesh draft, not a byte-identical Blender export.

### Full local workflow

[Download the full local Workshop](assets/cinder-workshop-local.zip) if you want editable Blender source, saved projects, build logs, checks, and version review. It runs on your computer only; it does not expose a server to the internet.

Requirements: Windows, Node.js 22 or newer, and Blender. After extracting the download:

```powershell
npm.cmd start
```

Run that command in the extracted `Cinder Workshop` folder. Then open <http://127.0.0.1:8787/>. Stop it with `Ctrl+C`. If Blender is installed outside `C:\Program Files\Blender Foundation`, set `BLENDER_PATH` to `blender.exe` before starting it. Projects, photo references, and builds stay in the local `data/projects/` folder.

The author's working copy is at `C:\Games\Cinder Junction\Cinder Workshop`; it uses the same launch command. The download is a clean source copy and does not include the author's project data or logs.

The full local loop supports:

- Saved projects, written briefs, change notes, and a JPEG reference photo compressed in the browser.
- Separate known-fact and estimate notes by region. The image and notes are saved as review context, not measurements or geometry instructions.
- Manual tower controls for height, base radius, fins, core size, and palette.
- Real Blender builds with logs, progress polling, cancellation, and a separate folder for each version.
- A live Three.js preview of the exported GLB with orbit, frame, top view, wireframe, mesh statistics, a one-metre grid, and scale marker.
- Per-version snapshots of the trusted recipe code and hash, parameters, Blender version, checks, outputs, and review notes.
- Automatic mesh and export checks, version history, accept/reject review, plus GLB and editable Blender source downloads.

Failed or cancelled builds keep previous outputs usable. Automated checks cover geometry and export constraints; the person reviewing the model decides whether its shape and materials look right. The captured [workbench screen](assets/cinder-workshop-build.jpg) shows a built version and review controls. The [photo-reference screen](assets/cinder-workshop-reference.jpg) shows the saved photo with separate facts and estimates.

The main purpose remains a quick path from a photo or description to a real 3D object that can be viewed and tested in a game engine. This draft does **not** interpret a photo or description into geometry: the user sets the manual controls for the one tower recipe. It makes zero model calls, has no measured token or cost tracking, no saved custom recipe presets, and no print export. No slicer review or physical print has been tested.

The next milestones are bounded photo/description interpretation, reusable presets and structured instructions, and per-stage tracking of tokens, retries, accepted versions, and billable cost where known. A separate print profile could prepare physical props, but it needs real dimensions, connected solids, thickness checks, and slicer review. Efficiency should be measured as tokens and cost per accepted asset alongside quality, not assumed from elapsed time.

## Source records

- [Original art direction](assets/art-direction.md)
- [Original provenance and software notes](assets/asset-notes.md)
- [Preserved ImageGen prompt](assets/concept-prompt.txt)
- [Skill source lock and hashes](assets/skill-lock.json)
- [Original technical handoff and rebuild instructions](assets/technical.md)
- [Original QA record from 29 September 2026](assets/original-qa.md)

The source pack is preserved in Sundown at `assets/blender/cinder-foundry/`; its finished gallery, renders, video, concept, and installed skill records are in the original Downloads delivery. Exact authoring conversation/model information would need an additional original transcript before being listed as verified.
