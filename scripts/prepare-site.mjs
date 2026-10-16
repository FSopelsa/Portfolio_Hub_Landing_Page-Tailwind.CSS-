import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
for (const item of ['index.html', 'WORKFLOW.md', 'assets', 'showcase']) {
  await fs.cp(path.join(root, item), path.join(dist, item), { recursive: true });
}
