const MATERIALS = [
  { name: 'Iron', color: [0.055, 0.075, 0.08, 1], metallic: 0.7, roughness: 0.34 },
  { name: 'Copper', color: [0.55, 0.24, 0.085, 1], metallic: 0.75, roughness: 0.3 },
  { name: 'Sandstone', color: [0.48, 0.4, 0.28, 1], metallic: 0, roughness: 0.7 },
  { name: 'Ceramic', color: [0.42, 0.105, 0.045, 1], metallic: 0.1, roughness: 0.4 },
  { name: 'Core', color: [1, 0.35, 0.035, 1], metallic: 0.1, roughness: 0.25, emissive: [1, 0.35, 0.035] },
];
const v = (x, y, z) => [x, y, z];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, n) => [a[0] * n, a[1] * n, a[2] * n];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = a => { const length = Math.hypot(...a) || 1; return mul(a, 1 / length); };
const batches = MATERIALS.map(() => ({ positions: [], normals: [] }));

function triangle(material, a, b, c, normals = null, outward = null) {
  let points = [a, b, c];
  let vertexNormals = normals;
  const face = cross(sub(b, a), sub(c, a));
  if (outward && dot(face, outward) < 0) {
    points = [a, c, b];
    if (vertexNormals) vertexNormals = [normals[0], normals[2], normals[1]];
  }
  const faceNormal = unit(cross(sub(points[1], points[0]), sub(points[2], points[0])));
  const batch = batches[material];
  for (let i = 0; i < 3; i++) {
    batch.positions.push(...points[i]);
    batch.normals.push(...(vertexNormals?.[i] ?? faceNormal));
  }
}

function cylinder(material, centerY, radius, depth, sides) {
  const bottom = centerY - depth / 2, top = centerY + depth / 2;
  for (let i = 0; i < sides; i++) {
    const a0 = 2 * Math.PI * i / sides, a1 = 2 * Math.PI * (i + 1) / sides;
    const b0 = v(radius * Math.cos(a0), bottom, radius * Math.sin(a0));
    const t0 = v(b0[0], top, b0[2]);
    const b1 = v(radius * Math.cos(a1), bottom, radius * Math.sin(a1));
    const t1 = v(b1[0], top, b1[2]);
    const radial = unit(v(Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)));
    triangle(material, b0, t0, t1, [radial, radial, radial], radial);
    triangle(material, b0, t1, b1, [radial, radial, radial], radial);
    const topCenter = v(0, top, 0), bottomCenter = v(0, bottom, 0);
    triangle(material, topCenter, t1, t0, [v(0, 1, 0), v(0, 1, 0), v(0, 1, 0)], v(0, 1, 0));
    triangle(material, bottomCenter, b0, b1, [v(0, -1, 0), v(0, -1, 0), v(0, -1, 0)], v(0, -1, 0));
  }
}

function ellipsoid(material, center, radii, segments, rings) {
  const point = (row, col) => {
    const theta = Math.PI * row / rings, phi = 2 * Math.PI * col / segments;
    return v(center[0] + radii[0] * Math.sin(theta) * Math.cos(phi),
      center[1] + radii[1] * Math.cos(theta), center[2] + radii[2] * Math.sin(theta) * Math.sin(phi));
  };
  const normalAt = p => unit(v((p[0] - center[0]) / (radii[0] ** 2), (p[1] - center[1]) / (radii[1] ** 2), (p[2] - center[2]) / (radii[2] ** 2)));
  for (let row = 0; row < rings; row++) for (let col = 0; col < segments; col++) {
    const a = point(row, col), b = point(row + 1, col), c = point(row + 1, col + 1), d = point(row, col + 1);
    const na = normalAt(a), nb = normalAt(b), nc = normalAt(c), nd = normalAt(d);
    const outward1 = sub(add(add(a, b), c), mul(center, 3));
    const outward2 = sub(add(add(a, c), d), mul(center, 3));
    triangle(material, a, b, c, [na, nb, nc], outward1);
    triangle(material, a, c, d, [na, nc, nd], outward2);
  }
}

function fin(material, angle, height, radius) {
  const radial = [Math.cos(angle), Math.sin(angle)], tangent = [-Math.sin(angle), Math.cos(angle)];
  const steps = 16, points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, radialDistance = radius * (0.78 - 0.56 * t * t);
    const width = radius * (0.28 * (1 - t) + 0.035), thickness = radius * 0.055;
    for (const [across, out] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const x = radial[0] * (radialDistance + out * thickness) + tangent[0] * across * width;
      const z = radial[1] * (radialDistance + out * thickness) + tangent[1] * across * width;
      points.push(v(x, height * (0.14 + t * 0.86), z));
    }
  }
  for (let row = 0; row < steps; row++) for (let side = 0; side < 4; side++) {
    const a = points[row * 4 + side], b = points[row * 4 + (side + 1) % 4];
    const c = points[(row + 1) * 4 + (side + 1) % 4], d = points[(row + 1) * 4 + side];
    triangle(material, a, b, c); triangle(material, a, c, d);
  }
  for (const indices of [[3, 2, 1, 0], [steps * 4, steps * 4 + 1, steps * 4 + 2, steps * 4 + 3]]) {
    const [a, b, c, d] = indices.map(index => points[index]);
    triangle(material, a, b, c); triangle(material, a, c, d);
  }
}

function makeGlb(parameters) {
  const output = [], views = [], accessors = [], meshes = [], nodes = [];
  let byteLength = 0;
  const chunks = [];
  function append(values, target, includeBounds = false) {
    const array = new Float32Array(values), bytes = new Uint8Array(array.buffer);
    const view = views.length;
    views.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.byteLength, target });
    byteLength += bytes.byteLength; chunks.push({ offset: views[view].byteOffset, bytes });
    const accessor = { bufferView: view, componentType: 5126, count: array.length / 3, type: 'VEC3' };
    if (includeBounds) {
      accessor.min = [0, 1, 2].map(axis => Math.min(...Array.from({ length: array.length / 3 }, (_, i) => array[i * 3 + axis])));
      accessor.max = [0, 1, 2].map(axis => Math.max(...Array.from({ length: array.length / 3 }, (_, i) => array[i * 3 + axis])));
    }
    const index = accessors.length; accessors.push(accessor); return index;
  }
  for (let material = 0; material < batches.length; material++) {
    const batch = batches[material];
    if (!batch.positions.length) continue;
    const position = append(batch.positions, 34962, true), normal = append(batch.normals, 34962);
    const meshIndex = meshes.length;
    meshes.push({ name: MATERIALS[material].name, primitives: [{ attributes: { POSITION: position, NORMAL: normal }, material, mode: 4 }] });
    nodes.push({ name: MATERIALS[material].name, mesh: meshIndex });
  }
  for (const chunk of chunks) output.push(chunk);
  const binary = new Uint8Array(byteLength);
  for (const chunk of output) binary.set(chunk.bytes, chunk.offset);
  const gltf = {
    asset: { version: '2.0', generator: 'Cinder Workshop Browser Trial' },
    scene: 0, scenes: [{ nodes: [0] }],
    nodes: [{ name: 'CinderTower', children: nodes.map((_, index) => index + 1), extras: { recipe: 'cinder-tower-v1-browser', units: 'metres', parameters } }, ...nodes],
    meshes,
    materials: MATERIALS.map((item, index) => ({ name: item.name,
      pbrMetallicRoughness: { baseColorFactor: index === 3 && parameters.palette === 'teal' ? [0.06, 0.29, 0.27, 1] : item.color, metallicFactor: item.metallic, roughnessFactor: item.roughness },
      ...(index === 4 && parameters.palette === 'teal' ? { emissiveFactor: [0.05, 0.8, 0.7] } : item.emissive ? { emissiveFactor: item.emissive } : {}),
      ...(index === 3 ? { doubleSided: true } : {}) })),
    accessors, bufferViews: views, buffers: [{ byteLength }],
  };
  const jsonBytes = new TextEncoder().encode(JSON.stringify(gltf));
  const jsonLength = Math.ceil(jsonBytes.length / 4) * 4, binLength = Math.ceil(binary.length / 4) * 4;
  const total = 12 + 8 + jsonLength + 8 + binLength;
  const glb = new ArrayBuffer(total), view = new DataView(glb), bytes = new Uint8Array(glb);
  view.setUint32(0, 0x46546c67, true); view.setUint32(4, 2, true); view.setUint32(8, total, true);
  view.setUint32(12, jsonLength, true); view.setUint32(16, 0x4e4f534a, true); bytes.fill(0x20, 20, 20 + jsonLength); bytes.set(jsonBytes, 20);
  const binHeader = 20 + jsonLength;
  view.setUint32(binHeader, binLength, true); view.setUint32(binHeader + 4, 0x004e4942, true); bytes.set(binary, binHeader + 8);
  return new Blob([glb], { type: 'model/gltf-binary' });
}

export function buildTowerGlb(parameters) {
  for (const batch of batches) { batch.positions.length = 0; batch.normals.length = 0; }
  const { height, radius, fins, core, palette } = parameters;
  if (!Number.isFinite(height) || height < 1 || height > 8 || !Number.isFinite(radius) || radius < 0.4 || radius > 2 ||
      !Number.isInteger(fins) || fins < 2 || fins > 6 || !Number.isFinite(core) || core < 0.3 || core > 1 || !['ember', 'teal'].includes(palette)) {
    throw new Error('Choose values within the recipe limits.');
  }
  if (palette === 'teal') {
    MATERIALS[3].color = [0.06, 0.29, 0.27, 1]; MATERIALS[4].color = [0.05, 0.8, 0.7, 1]; MATERIALS[4].emissive = [0.05, 0.8, 0.7];
  } else {
    MATERIALS[3].color = [0.42, 0.105, 0.045, 1]; MATERIALS[4].color = [1, 0.35, 0.035, 1]; MATERIALS[4].emissive = [1, 0.35, 0.035];
  }
  cylinder(0, height * 0.055, radius, height * 0.11, 6);
  cylinder(1, height * 0.09, radius * 1.005, height * 0.025, 6);
  cylinder(2, height * 0.14, radius * 0.89, height * 0.09, 6);
  cylinder(0, height * 0.28, radius * 0.46, height * 0.2, 48);
  for (let i = 0; i < 3; i++) cylinder(1, height * (0.21 + i * 0.065), radius * 0.48, height * 0.018, 48);
  for (let i = 0; i < fins; i++) {
    const angle = 2 * Math.PI * i / fins;
    fin(3, angle, height, radius);
    ellipsoid(1, v(Math.cos(angle) * radius * 0.76, height * 0.18, Math.sin(angle) * radius * 0.76),
      [radius * 0.12, height * 0.045, radius * 0.12], 12, 8);
  }
  ellipsoid(4, v(0, height * 0.61, 0), [radius * core * 0.53, height * core * 0.22, radius * core * 0.53], 32, 20);
  const blob = makeGlb(parameters);
  const triangles = batches.reduce((sum, batch) => sum + batch.positions.length / 9, 0);
  return { blob, triangles };
}
