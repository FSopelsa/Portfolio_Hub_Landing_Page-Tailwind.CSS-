# Production notes

## Authored content

The four meshes, custom glyph forms, procedural surface recipes and transform animations were authored for this request using Blender Python and the included scripts. No downloaded third-party 3D models or material packs were used. The finished PNG textures were baked from those Blender materials. The decorative glyphs are original, with no claim to an official Vulcan alphabet or translation.

`concept/foundry-sanctuary-concept.png` was generated with the built-in OpenAI ImageGen tool as a design reference. Its prompt is preserved beside it. The final asset renders are in `renders/`; those depict the shipped GLBs.

## Software and guidance

- Blender 4.5.3 LTS portable, downloaded from Blender's official release server. Archive SHA-256: `6b657c8bdd3a7b65b07b9e1ae17eb4be7dd4aa23121da7f3d3354fc2551330a7`, checked against the official release checksum.
- Three.js 0.185.0 is included in the preview under its MIT license. See `viewer/vendor/THREE-LICENSE.txt`; retain it when redistributing the preview code.
- The optional build scripts use glTF Transform 4.5.1, MikkTSpace 1.1.1, Khronos glTF Validator 2.0.0-dev.3.10 and Pillow 12.3.0. Exact Node dependencies are recorded in `source/package-lock.json`. Their packages are installed only when rebuilding, and retain their upstream licenses.
- Skill discovery used `find-skills`. The local workflow used `imagegen`, the browser asset pipeline guidance, and Blender modeling, materials, lighting and export skills from [RobLe3/cc-blender-skill](https://github.com/RobLe3/cc-blender-skill). Four Blender skills were installed for this workspace.
- The Tripo and Gemini workflow skills were inspected. Final meshes were made locally in Blender; no Tripo or Gemini generation was used.

The franchises named in the brief informed the art direction. This pack contains no franchise logos or extracted franchise assets.

## Portfolio delivery optimization — 15 October 2026

This portfolio serves resized WebP versions of the two page images, including smaller responsive variants. Its six GLBs retain the original mesh and animation data and texture resolution, with embedded PNG textures replaced by lossless WebP. Decoded texture pixels were compared against the original delivery, and all six optimized GLBs passed validation with zero errors and warnings.

The page images total 383,210 bytes across all four variants (original PNGs: 8,032,936 bytes). The GLBs total 19,191,848 bytes (originals: 26,410,872 bytes). The original source pack is preserved separately. See [optimization-report.json](optimization-report.json) for per-file results and the portfolio's `scripts/optimize-assets.mjs` for the repeatable conversion and checks. The existing Three.js gallery supports the `EXT_texture_webp` extension without an additional decoder.
