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
