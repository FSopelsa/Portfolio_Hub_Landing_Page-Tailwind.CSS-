# Technical handoff

## Coordinates and placement

- Blender uses Z-up. Exported GLBs use glTF Y-up.
- One unit is one meter. Roots are centered on the asset footprint; ground is local Y = 0. No camera, studio floor or light is embedded in the individual GLBs.
- Ember is about 5.12 m tall; the condenser is 3.22 m. The cache is about 1.18 × 0.65 × 0.75 m. Paving is about 1.73 × 0.195 × 1.99 m (X × Y × Z).
- Scale the root uniformly to suit your map. Sockets, mesh and animation then scale together.
- Root extras include a suggested cylinder collision proxy. These are metadata, not simulated physics bodies. Use the game's placement/navigation system to define the actual obstacle. A conservative circular footprint is 1.6 m radius for Ember and 1.15 m for the condenser at authoring scale.
- Cache feet begin about 1.5 cm above the origin. You can offset it down slightly on a perfectly flat surface. Runtime bounds for every export are in `runtime-contract.json`.

## Textures and materials

GLBs embed PNG maps; they load with a standard GLTFLoader. No Draco or Meshopt decoder is required. Towers use `KHR_materials_emissive_strength`, supported by the tested Three.js loader.

| Map | Interpretation |
|---|---|
| Base color | sRGB |
| Normal | Linear data, tangent-space normal |
| ORM | R = white (no baked AO), G = roughness, B = metalness |
| Molten emission | sRGB, Ember core only, 512 px |

Separate roughness and metallic PNGs are also included for editing. The small glyphs, bolts, trim and hoses are modeled geometry; broad material variation and fine surface normal detail are baked. The molten pattern is a texture, with separate luminous filaments.

The GLBs use opaque PBR surfaces. The condenser's luminous capsule suggests contained energy without depending on transparent refraction. Bloom, environment reflections, local point lights and drifting sparks are part of the preview renderer. Add the effects your game's lighting model needs.

## Animation and sockets

| Asset | Clip | Duration | Suggested playback |
|---|---|---:|---|
| Ember | `Idle` | 4.033 s | Loop |
| Ember | `Fire` | 0.800 s | Once on a simulation event |
| Condenser | `Idle` | 4.033 s | Loop |
| Condenser | `Pulse` | 0.800 s | Once on a simulation event |

These are transform animations on named part pivots. No armature or skinning is needed. The activation clips are small charge/release movements; they do not contain projectile meshes or gameplay logic. The gallery adds a temporary emission/light pulse when the activation button is used.

| Socket | Model-local position, meters (Y-up) |
|---|---|
| `socket_ember_muzzle` | (0, 3.29, 0) |
| `socket_aether_field` | (0, 1.40, 0) |

Get the socket's world position after updating the object's world matrix. The helper handles that. The sockets define attachment positions; aiming a projectile remains the render layer's responsibility.

Blender runtime files open with `Idle` enabled in the NLA editor. `Fire` / `Pulse` tracks are present but muted so a preview does not combine every clip. To inspect one, mute Idle and unmute the activation track, then scrub its first 25 frames.

## Rebuild

The included `.blend` files are immediately editable. Rebuilding is optional and overwrites the generated files, so work from a copy if you have made manual changes.

Tested: Blender 4.5.3 LTS, Node 24.15, Python 3.14 with Pillow 12.3.0. Baking and rendering are configured for NVIDIA OptiX; adjust the Cycles device selection in the Python scripts for another GPU or CPU. The source construction itself needs only Blender and its bundled Python libraries.

Run from the pack's root, with `blender`, `node`, `npm` and `python` available:

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

Intermediate raw exports go to a sibling `work/raw` folder. `optimize.mjs` removes degenerate faces, rebuilds MikkTSpace tangents, deduplicates resources, adds the activation clips, writes the final GLBs, and records Khronos validation results. The editable detailed source and the compact runtime Blender files serve different purposes; edit the detailed source before rebaking when changing the design.

To rebuild only one asset, pass its ID after `--` to `export_assets.py`, for example `-- ember-reliquary`. Optimization reads all GLBs currently present in `work/raw`.

## Local preview

`python viewer/serve.py` serves this pack on `127.0.0.1:8776` and opens the gallery. Stop it with Ctrl+C. Use `--no-open` to start only the server. The server binds to the local machine; it does not publish the files online. If the port is in use, stop the previous preview or change `PORT` in the script.
