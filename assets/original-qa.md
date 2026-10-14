# Verification

Checked on 29 September 2026.

## Files and geometry

- All six final GLBs passed Khronos glTF Validator with **zero errors, zero warnings and zero informational issues**. Individual JSON reports are beside this document.
- An independent read of the final binaries confirmed finite bounds, placement above the ground origin, the required attachment nodes, both idle loops and both activation clips. Results: `runtime-contract.json`.
- Degenerate faces were removed and MikkTSpace tangents rebuilt after mesh reduction. Final triangle counts in `asset-manifest.json` are taken from the optimized binaries.
- Running the delivered optimization script against the raw Blender exports reproduced all six final GLBs byte for byte, checked with SHA-256.
- Final GLBs were reimported to Blender for the runtime review files. The tower files contain `Idle` plus `Fire` / `Pulse` tracks and packed images. Textures do not depend on an external absolute path.

## Visual review

- Cycles renders were made by importing the final GLBs. The set includes the collection, each tower, a close-up, and an elevated gameplay angle.
- The full turntable is 192 frames at 24 fps, 1440 × 1080. Front, side and rear frames were inspected for framing, missing geometry and material problems.
- The Three.js / WebGL gallery loaded all four objects and both tower LODs. Reported totals match the binary counts: 88,060 or 32,751 triangles, 15 asset primitive draws.
- Model selection, camera presets, LOD switching, lighting, wireframe, pause/resume and activation were exercised using the browser's keyboard-accessible controls. The final gallery uses the same `threejs-integration.js` helper supplied for game integration.
- No fatal browser console errors were observed in the final gallery. The local graphics driver emitted a Three.js shader compiler warning about floating-point rounding; it did not prevent rendering.

## Practical limits

This checks asset validity and presentation in an isolated desktop viewer. It is not a benchmark of the game's battlefield, and the game repository was not modified or tested. Tower balance, collision integration, targeting and projectile behavior remain in the game's simulation. Review crowd density, shadow cost and texture memory in the real scene before choosing LOD distances.
