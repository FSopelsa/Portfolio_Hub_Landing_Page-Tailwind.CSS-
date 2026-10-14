# Cinder Foundry / Sanctuary kit

For **Sundown at Cinder Junction**.

## Objects

- **Ember Reliquary** — an elemental defense tower. Three ceramic fins bend around a suspended furnace seed. Salvaged foundry machinery occupies the lower half; the upper half becomes spare, ceremonial and precise.
- **Wayfarer Condenser** — a companion support structure. Two unequal swept blades protect a turquoise induction capsule. Its offset silhouette and cool light distinguish it from the attack tower at gameplay distance.
- **Junction paving and supply props** — a small modular vocabulary that carries the same materials into the ground plane.

## Visual rules

The frontier influence comes from serviceability: bolted covers, piston rods, replaceable heat shields, hoses, pressure dials, and ventilation. The alien influence comes from the silhouette: tall swept fins, narrow negative spaces, fine copper boundaries, and flowing vertical inscriptions.

Use broad warm sandstone and terracotta forms, medium dark iron recesses, and sparse polished copper. Amber identifies the furnace; turquoise identifies the condenser. Warm neutral key lighting should still reveal the silhouette with emission disabled.

The inscriptions are original decorative glyphs inspired by the vertical, calligraphic character of Vulcan lettering. They are not a claimed translation or reproduction of an official alphabet.

## Runtime direction

Blender is the editable source. GLB uses meters, glTF Y-up, ground-centered origins, and named animation/socket nodes. The meshes carry the material detail; render previews add lighting and a display ground. Gameplay remains in the JavaScript simulation.

Concept art was created with the built-in ImageGen tool. Final screenshots and renders are identified separately so the concept is never mistaken for the modeled result.

## Tools

Pipeline guidance used: `find-skills`, `imagegen`, `web-3d-asset-pipeline`. The Tripo skill was inspected; its credential probe reported missing. Meshes are authored locally in Blender Python. The four Blender-specific skills installed during discovery are from [RobLe3/cc-blender-skill](https://github.com/RobLe3/cc-blender-skill); their instructions were reviewed locally before use.
