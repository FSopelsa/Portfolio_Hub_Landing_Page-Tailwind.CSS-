/** Presentation-only helper. The game's JavaScript simulation decides when to fire. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.mjs';

export const cinderAssets = {
  ember: 'ember-reliquary',
  condenser: 'wayfarer-condenser',
  paving: 'junction-paving',
  cache: 'frontier-cell-cache',
  clampwright: 'cinder-clampwright',
  meditator: 'cinder-blue-humanoid',
};

/**
 * Load one asset and create its first presentation instance.
 * For many instances, cache loadCinderTemplate() and use createCinderInstance().
 */
export async function loadCinderTemplate(key, {
  baseURL = '/assets/models/cinder-foundry/',
  lod = 0,
} = {}) {
  const id = cinderAssets[key] ?? key;
  if (!Object.values(cinderAssets).includes(id)) throw new Error(`Unknown asset: ${key}`);
  const hasLOD = id === cinderAssets.ember || id === cinderAssets.condenser;
  const suffix = hasLOD && lod === 1 ? '-lod1' : '';
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(`${baseURL}${id}${suffix}.glb`);
  return gltf;
}

export async function loadCinderAsset(key, options) {
  return createCinderInstance(await loadCinderTemplate(key, options));
}

/** Create a transform/animation instance from a cached GLTF. Mesh resources are shared. */
export function createCinderInstance(gltf) {
  const object = gltf.scene.clone(true);
  object.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  const mixer = new THREE.AnimationMixer(object);
  const idle = gltf.animations.find(clip => clip.name === 'Idle');
  if (idle) mixer.clipAction(idle).play();
  const actions = Object.fromEntries(gltf.animations.map(clip => [clip.name, mixer.clipAction(clip)]));
  const socketPosition = new THREE.Vector3();
  return {
    object,
    mixer,
    actions,
    updatePresentation(deltaSeconds) { mixer.update(deltaSeconds); },
    playEffect(name) {
      const action = actions[name];
      if (!action) return false;
      action.reset().setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = false;
      action.play();
      return true;
    },
    getSocketWorldPosition(name, target = socketPosition) {
      const socket = object.getObjectByName(name);
      if (!socket) throw new Error(`Missing socket: ${name}`);
      object.updateMatrixWorld(true);
      return socket.getWorldPosition(target);
    },
    disposeInstance() {
      mixer.stopAllAction();
      mixer.uncacheRoot(object);
      object.removeFromParent();
      // Shared geometry/material/texture ownership remains with your asset cache.
    },
  };
}

// Example (your render layer):
// const tower = await loadCinderAsset('ember', { lod: 1 });
// scene.add(tower.object);
// tower.object.position.set(worldX, groundY, worldZ);
// tower.updatePresentation(deltaSeconds);           // each render frame
// tower.playEffect('Fire');                         // on a simulation fire event
// tower.getSocketWorldPosition('socket_ember_muzzle', outPosition);
