# Cinder Workshop — implementation prompt

Use a new project folder and select **GPT-6 Astra** in Codex. Paste the prompt below. The authoring model selected in Codex and the model used by a future application API are separate choices.

---

Implement **Cinder Workshop**, a local personal application for my asset production methodology. Build the working app, rather than stopping at a plan or mockup.

## Main purpose

**Quickly turn just a photograph or written description into an actual 3D object that I can view, place, and test inside a game engine.** The main output is usable geometry and an engine-compatible GLB. Support stylized interpretation; make uncertain dimensions and hidden shapes explicit. A photo or short description must be enough to start. Optional measurements improve accuracy without becoming a required form-filling exercise.

Over time, the methodology should preserve similar quality while using fewer LLM tokens and costing less through reusable recipes and focused revisions. Treat savings as something to measure. Printing physical props is a second output path.

## Work style and scope

Use `$ponytail:ponytail` at full level. Read its installed SKILL.md. Follow applicable AGENTS.md instructions. Start by inspecting this new project's actual files and the specific references below. Reuse what is useful and keep the first implementation small. Complete one usable asset journey with all four features below; avoid speculative infrastructure.

The new project's folder is the only source-writing destination. Treat these existing projects as read-only references:

- `C:\Users\F\IdeaProjects\Frontend\TailwindCSS-Workshop\WORKFLOW.md` — purpose, provenance, skills, and production records.
- `C:\Users\F\IdeaProjects\Frontend\TailwindCSS-Workshop\showcase\` — the working Three.js viewer, integration helper, licensed required modules, and example GLBs.
- `C:\Games\Egna\Sundown at Cinder Junction\assets\blender\cinder-foundry\source\` — construction, baking, export, and optimization scripts.
- `C:\Games\Egna\Sundown at Cinder Junction\docs\3d\cinder-foundry\README.md` — engine integration and scale contracts.

The original build scripts overwrite outputs relative to their pack location. Copy and adapt a focused recipe into this project before executing it. Preserve licences and provenance when reusing code/assets. Do not alter Sundown, the portfolio, global agent configuration, or installed plugins. Do not commit, push, publish, or deploy.

Read relevant available `three-webgl-game`, `web-3d-asset-pipeline`, and Blender modeling/export skill instructions. Use Context7 for current library/API syntax. Do not assume that every dependency listed by a skill is needed.

## Four required features

### 1. Personal recipe library

Turn one useful asset family from the existing work into a parameterized, reproducible Blender recipe. Tower/industrial-prop construction is a good first family; inspect the code before selecting it. Expose a small set of meaningful controls: proportions, base profile, fin/core arrangement, fittings or glyph treatment, and material palette where supported.

Keep recipe code in this repository and parameters in validated structured data. Provide a preset inspired by the existing Cinder style and allow saving a customized preset. Parameter changes must produce different real geometry/materials, and rebuilding the same recipe/version/parameters/seed must be reproducible. Do not pass arbitrary LLM-generated Python straight to execution.

### 2. Annotated reference brief

Accept a local photograph or a written description. Show the reference and an editable brief together. Let me mark a region and attach a short note about shape, material, or importance. Support an optional known measurement and distinguish estimates from user-supplied facts.

Use one vision-capable provider, when approved access is available, to interpret a photo or description into the bounded recipe parameters and assumptions. Present those parameters for review before a build. Changing them manually must also work. Persist the reference, annotations, brief, and approved parameters.

Inspect available approved credentials and current official model/SDK contracts before choosing the application model; GPT-6 Astra is the Codex implementation model, not an assumed API identifier. If an API key must be set up, use the available OpenAI Platform and local-destination confirmation tools. Keep secrets server-side and out of logs/artifacts. Make no paid generation calls until I explicitly approve a concrete example and spending bound. Implement and check the local recipe path and deterministic interpretation fixture while that approval is pending. Clearly label fixtures; report any remaining live-photo limitation honestly.

### 3. Game and print output profiles

Provide a real local Blender build action with progress/logs, a Three.js preview of its generated GLB, and a game-export download. Preview and export the newly generated result, not a static example substituted for it. Reuse appropriate orbit, framing, lighting, wireframe, and detail controls from the existing viewer.

The game profile needs explicit scale, a ground-centered pivot, sensible materials, named parts, and valid GLB. Preserve animation/sockets if the selected recipe uses them. Use a small Three.js game runtime as the first engine target, matching Sundown's stack. Include a scene where I can place the exported asset on a ground plane beside a scale marker, move/rotate it, and inspect it under neutral lighting. Load the downloaded GLB into that scene as the engine acceptance check. Other engines require their own importer/integration check before claiming compatibility.

Provide a separate print preparation/export path for the same design, with a physical size setting, appropriate connected geometry/thickness, and an actual STL download. Validate/report scale, open boundaries, disconnected components, and thin features to the extent implemented. Show what passed and what still needs slicer review; never label an unchecked mesh print-ready. Do not export preview lights, floors, or helper objects. Explain that texture/emission/animation do not carry into STL and that slicer settings depend on the printer/material. Do not promise a physical print without one being tested.

### 4. Production journal

Save each asset project and its versions locally: reference/description, annotations, brief, recipe/version/seed/parameters, instruction revision, output files, build/check results, timestamps, notes, and acceptance status. Record the actual skills/tool versions used when known; unknown provenance stays unknown.

For model calls, record provider/model, stage, reported input/output/cached token usage where available, retries, and actual or explicitly estimated monetary cost with its dated pricing basis. Unknown usage/cost is unavailable, not zero. Local recipe-only builds can legitimately record zero model calls. Record rejected attempts as well as accepted outputs.

Show a simple comparison of versions, including tokens/cost per accepted asset and the same small visual/technical quality checklist. Do not claim savings from elapsed time, code length, or invented figures. Keep previous accepted outputs usable after a failed generation/build. Projects must survive an application restart.

## Implementation approach

Prefer a small local web app using the existing imperative Three.js patterns, a thin local service for trusted Blender execution and project files, and disk-backed JSON records. Use an existing starter if this project already has one. Avoid a database, accounts, cloud storage, marketplace, multi-provider abstraction, agent team, and deployment for this first version.

Bind the local service to loopback. Validate image/file inputs, recipe parameters, and job/project paths. Launch Blender with an argument array and a fixed trusted recipe; do not interpolate user input into shell commands. Keep generated files inside owned project/job directories. Preserve working versions and clear errors on a failed process. Do not make the UI wait for a request to return before it can display long-running progress or cancellation.

Find the installed Blender executable and check its version before building. Use the original scripts' recorded requirements as evidence, not as a reason to rewrite global tooling. Keep business/project state separate from disposable Three.js objects. Keep accessibility and keyboard operation in the core flow.

## Acceptance and handoff

Add small meaningful checks for parameter validation, owned-path restrictions, persistence, usage aggregation, failed-build preservation, and GLB/STL output. Exercise the actual browser journey and run a real Blender build. Verify the new GLB opens in the engine test scene and inspect the generated STL geometry. Do not substitute a successful bundle or screenshot for those checks.

Demonstrate one complete description-to-recipe-to-object journey locally, including a changed parameter producing a second version, saved history after restart, an accepted/rejected comparison, and both export profiles. Check the photo interpretation against a labelled fixture and, once authorized, a real example. If a required external credential or tool is unavailable, finish independent work and state precisely which live acceptance check remains blocked.

Deliver source, one documented startup command, an editable example project, brief architecture/recipe notes, a factual check report, and browser screenshots. Open the running app for me. Keep progress updates concise and distinguish completed features, fixtures, and unverified external behavior.

Start now with focused inspection, then implement the smallest complete version that satisfies these requirements. Ask only for information that materially blocks progress; handle routine implementation choices yourself.
