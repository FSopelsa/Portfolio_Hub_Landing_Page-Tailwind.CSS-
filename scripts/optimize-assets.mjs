import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { textureCompress } from '@gltf-transform/functions';
import { validateBytes } from 'gltf-validator';
import sharp from 'sharp';

assert(process.argv[2], 'Usage: npm run optimize:assets -- "path/to/original/outputs"');
const source = await fs.realpath(process.argv[2]);
const root = fileURLToPath(new URL('../', import.meta.url));
const report = { images: [], models: [] };
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const digest = data => createHash('sha256').update(data).digest('hex');
const pixels = async data => digest(await sharp(data).ensureAlpha().raw().toBuffer());

function modelContent(document) {
  const r = document.getRoot();
  return {
    nodes: r.listNodes().map(n => [n.getName(), n.getMatrix(), n.listChildren().map(c => c.getName()), n.getExtras()]),
    accessors: r.listAccessors().map(a => [a.getType(), a.getNormalized(), digest(Buffer.from(a.getArray().buffer, a.getArray().byteOffset, a.getArray().byteLength))]).sort(),
    primitives: r.listMeshes().flatMap(m => m.listPrimitives().map(p => [m.getName(), p.getMode(), p.listSemantics(), p.getIndices()?.getCount(), p.getMaterial()?.getName()])),
    animations: r.listAnimations().map(a => [a.getName(), a.listChannels().map(c => [c.getTargetNode()?.getName(), c.getTargetPath(), c.getSampler().getInterpolation()])]),
    materials: r.listMaterials().map(m => m.getName()),
    triangles: r.listMeshes().flatMap(m => m.listPrimitives()).reduce((sum, p) => sum + (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3, 0),
  };
}

for (const [input, name, widths] of [
  ['renders/01-cinder-foundry.png', 'cinder-foundry', [1600, 800]],
  ['concept/foundry-sanctuary-concept.png', 'foundry-concept', [1280, 768]],
]) {
  const original = await fs.readFile(path.join(source, input));
  const image = { source: input, beforeBytes: original.length, variants: [] };
  for (const [i, width] of widths.entries()) {
    const file = `assets/${name}${i ? `-${width}` : ''}.webp`;
    const { data, info } = await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toBuffer({ resolveWithObject: true });
    assert(data.length < original.length, `${file}: optimization must reduce bytes`);
    assert.equal((await sharp(data).metadata()).width, width);
    await fs.writeFile(path.join(root, file), data);
    image.variants.push({ file, bytes: data.length, width: info.width, height: info.height });
  }
  report.images.push(image);
}

const modelFiles = (await fs.readdir(path.join(root, 'showcase/models'))).filter(f => f.endsWith('.glb')).sort();
assert.equal(modelFiles.length, 6, 'Expected the six Cinder Foundry exports');
for (const file of modelFiles) {
  const input = await fs.realpath(path.join(source, 'models', file));
  const output = await fs.realpath(path.join(root, 'showcase/models', file));
  assert.notEqual(input.toLowerCase(), output.toLowerCase(), 'Use the original pack as input, not already optimized files');
  const original = await fs.readFile(input);
  const document = await io.readBinary(original);
  const before = modelContent(document);
  const texturePixels = await Promise.all(document.getRoot().listTextures().map(t => pixels(t.getImage())));
  await document.transform(textureCompress({ encoder: sharp, targetFormat: 'webp', lossless: true, effort: 100 }));
  const bytes = await io.writeBinary(document);
  const decoded = await io.readBinary(bytes);
  assert.deepEqual(modelContent(decoded), before, `${file}: geometry, hierarchy, or animation changed`);
  assert.deepEqual(await Promise.all(decoded.getRoot().listTextures().map(t => pixels(t.getImage()))), texturePixels, `${file}: texture pixels changed`);
  assert(bytes.length < original.length, `${file}: optimization must reduce bytes`);
  const validation = await validateBytes(bytes, { uri: file, maxIssues: 0, writeTimestamp: false });
  assert.equal(validation.issues.numErrors, 0, `${file}: glTF validation errors`);
  assert.equal(validation.issues.numWarnings, 0, `${file}: glTF validation warnings`);
  await fs.writeFile(output, bytes);
  report.models.push({ file, beforeBytes: original.length, afterBytes: bytes.length, triangles: before.triangles, animations: before.animations.map(a => a[0]), textures: decoded.getRoot().listTextures().map(t => ({ name: t.getName(), size: t.getSize(), mimeType: t.getMimeType() })), validation: validation.issues });
  console.log(`${file}: ${original.length} → ${bytes.length} bytes`);
}

await fs.writeFile(path.join(root, 'assets/optimization-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log('All model content and decoded texture pixels preserved; six GLBs validated.');
