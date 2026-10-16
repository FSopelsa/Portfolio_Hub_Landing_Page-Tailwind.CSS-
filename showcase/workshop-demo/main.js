import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { buildTowerGlb } from './recipe.js';

const $ = id => document.getElementById(id);
const MAX_BUILDS = 2;
const STORAGE_KEY = 'cinder-workshop-browser-builds-v1';
let used = 0, currentUrl = '', referenceUrl = '', currentModel = null, busy = false;

function savedBuildCount() {
  try {
    const value = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    return Number.isInteger(value) ? Math.max(0, Math.min(MAX_BUILDS, value)) : 0;
  } catch { return 0; }
}
function recordBuild() {
  used = Math.min(MAX_BUILDS, used + 1);
  try { localStorage.setItem(STORAGE_KEY, String(used)); } catch { /* Keep the count for this page session. */ }
  updateLimit();
}
function updateLimit() {
  const left = Math.max(0, MAX_BUILDS - used);
  $('build-limit').textContent = `${left} build${left === 1 ? '' : 's'} available`;
  $('usage').textContent = `${left} of ${MAX_BUILDS} browser builds left`;
  $('build').disabled = left === 0 || busy;
  $('build').innerHTML = left === 0 ? 'Demo builds used <span aria-hidden="true">✓</span>' : busy ? 'Building your model…' : 'Build this version <span aria-hidden="true">↗</span>';
}
function parameters() {
  return { height: Number($('height').value), radius: Number($('radius').value), fins: Number($('fins').value), core: Number($('core').value), palette: $('palette').value };
}
function updateValues() {
  $('height-value').value = `${Number($('height').value).toFixed(1)} m`;
  $('radius-value').value = `${Number($('radius').value).toFixed(2)} m`;
  $('core-value').value = `${Math.round(Number($('core').value) * 100)}%`;
}

const canvas = $('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#1a221c');
const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100);
camera.position.set(6, 5.5, 7);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
scene.add(new THREE.HemisphereLight(0xe4eed5, 0x293027, 2.2));
const key = new THREE.DirectionalLight(0xffe0b1, 3.2); key.position.set(4, 8, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0x7ddaca, 1.4); rim.position.set(-5, 3, -4); scene.add(rim);
const grid = new THREE.GridHelper(12, 12, 0x829375, 0x455346); grid.position.y = -0.003; scene.add(grid);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2, 0);
const loader = new GLTFLoader();
function resize() {
  const box = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(box.width));
  const height = Math.max(1, Math.round(box.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
const observer = new ResizeObserver(resize);
observer.observe(canvas);
resize();
function render() { controls.update(); renderer.render(scene, camera); requestAnimationFrame(render); }
render();
function fit(model) {
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const span = Math.max(size.x, size.y, size.z, 1);
  model.position.sub(center);
  scene.add(model);
  grid.position.y = -size.y / 2;
  controls.target.set(0, 0, 0);
  camera.position.set(span * 1.55, span * 1.28, span * 1.75);
  camera.near = Math.max(0.01, span / 200);
  camera.far = span * 20;
  camera.updateProjectionMatrix();
}
async function showModel(blob) {
  const url = URL.createObjectURL(blob);
  const gltf = await loader.loadAsync(url);
  if (currentModel) scene.remove(currentModel);
  currentModel = gltf.scene;
  fit(currentModel);
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  currentUrl = url;
}

for (const id of ['height', 'radius', 'core']) $(id).addEventListener('input', updateValues);
$('reference').addEventListener('change', () => {
  const file = $('reference').files?.[0];
  const image = $('reference-preview');
  if (referenceUrl) URL.revokeObjectURL(referenceUrl);
  if (!file) { image.hidden = true; image.removeAttribute('src'); return; }
  referenceUrl = URL.createObjectURL(file);
  image.src = referenceUrl;
  image.hidden = false;
});
$('generator').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || used >= MAX_BUILDS) return;
  busy = true; $('status').classList.remove('error'); $('status').textContent = 'Building the tower mesh in this browser…';
  $('download').hidden = true; updateLimit();
  try {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const result = buildTowerGlb(parameters());
    await showModel(result.blob);
    recordBuild();
    const config = parameters();
    const filename = `cinder-tower-${config.height.toFixed(1)}m-${config.palette}.glb`;
    const link = $('download');
    link.href = currentUrl; link.download = filename; link.hidden = false;
    $('empty-preview').hidden = true;
    $('model-badge').textContent = `BUILT / ${used}`;
    $('stats').textContent = `${result.triangles.toLocaleString()} triangles · ${(result.blob.size / 1024).toFixed(0)} KB · ${config.height.toFixed(1)} m high`;
    $('status').textContent = 'Your GLB is ready. Download it before you leave.';
  } catch (error) {
    $('status').classList.add('error'); $('status').textContent = `Build failed: ${error.message}`;
  } finally { busy = false; updateLimit(); }
});

used = savedBuildCount(); updateValues(); updateLimit();
