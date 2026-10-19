import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadCinderTemplate, createCinderInstance } from '../source/threejs-integration.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const canvas=document.querySelector('#scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.96;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
const scene=new THREE.Scene();scene.background=new THREE.Color('#161d1b');scene.fog=new THREE.FogExp2('#161d1b',.025);
const camera=new THREE.PerspectiveCamera(33,innerWidth/innerHeight,.1,150);camera.position.set(7.6,6.7,11.8);
const composer=new EffectComposer(renderer);composer.renderTarget1.samples=4;composer.renderTarget2.samples=4;composer.addPass(new RenderPass(scene,camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.30,.45,1.1));composer.addPass(new OutputPass());
const controls=new OrbitControls(camera,canvas);controls.target.set(0,1.95,0);controls.enableDamping=true;controls.dampingFactor=.065;controls.maxPolarAngle=Math.PI*.49;controls.minDistance=1.5;controls.maxDistance=28;controls.update();
const pmrem=new THREE.PMREMGenerator(renderer);const environment=new RoomEnvironment();
scene.environment=pmrem.fromScene(environment,.02).texture;environment.dispose();scene.environmentIntensity=.48;
const ambient=new THREE.HemisphereLight('#aabfc4','#473020',.7);scene.add(ambient);
const sun=new THREE.DirectionalLight('#ffbe7b',3.2);sun.position.set(-4.5,8,3);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.1,far:30});sun.shadow.bias=-.00015;sun.shadow.normalBias=.035;sun.shadow.radius=3;scene.add(sun);
const rim=new THREE.DirectionalLight('#6ea5aa',2);rim.position.set(3,4,-5);scene.add(rim);
const front=new THREE.DirectionalLight('#e5d0a4',.7);front.position.set(2,4,5);scene.add(front);
const groundmat=new THREE.MeshStandardMaterial({color:'#171b18',roughness:.97,metalness:.04});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),groundmat);ground.rotation.x=-Math.PI/2;ground.position.y=-.055;ground.receiveShadow=true;scene.add(ground);
// The studio platform is presentation scenery, excluded from all asset exports.
const platform=new THREE.Mesh(new THREE.CylinderGeometry(4.12,4.2,.14,96),new THREE.MeshStandardMaterial({color:'#454338',roughness:.83,metalness:.18}));platform.position.y=-.055;platform.receiveShadow=true;scene.add(platform);
const edge=new THREE.Mesh(new THREE.TorusGeometry(4.14,.012,5,160),new THREE.MeshStandardMaterial({color:'#987147',metalness:1,roughness:.56}));edge.rotation.x=Math.PI/2;edge.position.y=.006;scene.add(edge);
const field=new THREE.Group();scene.add(field);
const models=new Map(),mixers=new Map(),instances=new Map(),manifest=new Map();let current='ensemble',motion=true,wireframe=false,lod=1,pulseTime=-10,visualTime=0,transition=null;
const clock={elapsedTime:0,last:performance.now(),getDelta(){const now=performance.now();const dt=(now-this.last)/1000;this.last=now;this.elapsedTime+=dt;return dt;}};
const ids=['ember-reliquary','wayfarer-condenser','frontier-cell-cache','junction-paving','cinder-clampwright','cinder-blue-humanoid'];
const labels={
  ensemble:['Cinder Foundry','FRONTIER ENGINEERING / ALIEN RITUAL','Machines with a second life.<br>Sanctuaries with a purpose.'],
  'ember-reliquary':['Ember Reliquary','01 / ELEMENTAL DEFENSE TOWER','A captive furnace. Three inscribed heat shields. Built to hold the line.'],
  'wayfarer-condenser':['Wayfarer Condenser','02 / SUPPORT STRUCTURE','A cool current beneath weathered copper. An asymmetric silhouette for a different battlefield role.'],
  'frontier-cell-cache':['Frontier Cell Cache','03 / WORLD PROP','Replaceable cells and field supplies. Hand-carried, repaired, used again.'],
  'junction-paving':['Junction Paving','04 / MODULAR GROUND','Six stone segments, expansion joints, and copper tracery. A small piece of a larger place.'],
  'cinder-clampwright':['Clampwright','05 / WORKSHOP ENGINEER','A reference-led character, now stationed beside the Siege upgrade bench. The updated robe, clasped pose, and animated eye stalks are built into the game.'],
  'cinder-blue-humanoid':['Blue Humanoid','06 / IRRADIATED MEDITATOR','A seated character placed beside the cooling plant. Its softly moving crown and cyan light are now part of the Siege environment.']
};
let loadCount=0;
async function loadAsset(id,level=0){
  const key=id+':'+level;if(models.has(key))return models.get(key);
  const gltf=await loadCinderTemplate(id,{baseURL:'../models/',lod:level});
  const instance=createCinderInstance(gltf),model=instance.object;model.name=id;
  model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=true;
    const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){m.wireframe=wireframe;if(m.map)m.map.anisotropy=8;if(m.normalMap)m.normalMap.anisotropy=4;}
  }});
  let triangles=0,primitives=0;model.traverse(o=>{if(o.isMesh){triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;primitives+=Array.isArray(o.material)?o.material.length:1;}});
  manifest.set(key,{triangles,primitives,clips:gltf.animations.map(a=>a.name)});
  const mixer=instance.mixer;instances.set(key,instance);
  model.userData.clips=gltf.animations;
  mixers.set(key,mixer);models.set(key,model);model.visible=false;field.add(model);
  model.userData.originalEmission=[];
  model.traverse(o=>{if(o.isMesh)for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m.emissiveIntensity>0&&m.emissive?.getHex()>0)model.userData.originalEmission.push([m,m.emissiveIntensity]);});
  return model;
}
function modelLOD(id){return lod&&['ember-reliquary','wayfarer-condenser'].includes(id)?1:0;}
function activeKey(id){return id+':'+modelLOD(id);}
function showModels(){
  for(const m of models.values()){m.visible=false;m.position.set(0,0,0);m.rotation.set(0,0,0);m.scale.setScalar(1);}
  const show=current==='ensemble'?ids:[current];
  for(const id of show){const m=models.get(activeKey(id));if(!m)continue;m.visible=true;
    if(current==='ensemble'){
      if(id==='ember-reliquary')m.position.set(-1.38,.024,0);
      if(id==='wayfarer-condenser')m.position.set(1.6,.024,-.05);
      if(id==='frontier-cell-cache'){m.position.set(.95,.024,1.28);m.rotation.y=-.18;}
      if(id==='junction-paving')m.position.set(1.5,.024,-2.02);
    } else m.position.y=.024;
  }
  platform.visible=current==='ensemble';edge.visible=platform.visible;
  updateStats();
}
function updateStats(){
  const show=current==='ensemble'?ids:[current];let tris=0,draws=0;
  for(const id of show){const s=manifest.get(activeKey(id));if(s){tris+=s.triangles;draws+=s.primitives;}}
  document.querySelector('#stats').textContent=`${Math.round(tris).toLocaleString()} triangles · ${draws} material draws · LOD ${lod}`;
}
function framing(view='orbit'){
  const h=current==='ensemble'?5.1:current==='ember-reliquary'?5.1:current==='wayfarer-condenser'?3.25:current==='frontier-cell-cache'?1.15:current==='cinder-clampwright'?2.1:current==='cinder-blue-humanoid'?2.6:1.5;
  const y=current==='junction-paving'?.08:current==='frontier-cell-cache'?.32:current==='cinder-blue-humanoid'?.85:h*.43;
  let target=new THREE.Vector3(0,y,0),position;
  const s=h/5.1;
  if(view==='top'){target.y=1.75*s;position=new THREE.Vector3(1.8*s,14.2*s,9.2*s);}
  else if(view==='detail'){
    const at=current==='ensemble'||current==='ember-reliquary'?new THREE.Vector3(current==='ensemble'?-1.38:0,2.86,0):new THREE.Vector3(0,h*.45,0);
    target=at;position=at.clone().add(new THREE.Vector3(2.6,1.4,3.7).multiplyScalar(Math.max(.28,s)));
  }else position=new THREE.Vector3(7.6*s,6.7*s,11.8*s);
  if(innerWidth/innerHeight<1.35&&view!=='detail')position.sub(target).multiplyScalar(1.18).add(target);
  if(current==='ensemble'&&view==='orbit')target.x=.06;
  transition={start:performance.now(),fromPosition:camera.position.clone(),fromTarget:controls.target.clone(),position,target};
}
function setView(view){document.querySelectorAll('#views button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));framing(view);}
async function setAsset(id){
  current=id;document.querySelectorAll('#assets button').forEach(b=>b.classList.toggle('active',b.dataset.asset===id));
  const text=labels[id];document.querySelector('#title').textContent=text[0];document.querySelector('#eyebrow').textContent=text[1];document.querySelector('#description').innerHTML=text[2];
  showModels();setView('orbit');
}
document.querySelector('#assets').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setAsset(b.dataset.asset);});
document.querySelector('#views').addEventListener('click',e=>{if(e.target.dataset.view)setView(e.target.dataset.view);});
document.querySelector('#lighting').addEventListener('click',e=>{const l=e.target.dataset.light;if(!l)return;document.querySelectorAll('#lighting button').forEach(b=>b.classList.toggle('active',b.dataset.light===l));
  const studio=l==='studio';scene.background.set(studio?'#303936':'#161d1b');scene.fog.color.copy(scene.background);groundmat.color.set(studio?'#383d35':'#171b18');
  sun.color.set(studio?'#fff2d9':'#ffbe7b');sun.intensity=studio?3.8:3.2;ambient.intensity=studio?1.6:.7;rim.intensity=studio?1.2:2;scene.environmentIntensity=studio?.9:.48;
});
document.querySelector('#motion').addEventListener('click',e=>{motion=!motion;e.target.textContent=motion?'Ⅱ Pause motion':'▷ Play motion';e.target.setAttribute('aria-pressed',motion);});
document.querySelector('#wire').addEventListener('click',e=>{wireframe=!wireframe;e.target.setAttribute('aria-pressed',wireframe);for(const model of models.values())model.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material])m.wireframe=wireframe;});});
document.querySelector('#quality').addEventListener('click',async e=>{
  e.target.disabled=true;e.target.textContent='Loading LOD…';
  const next=lod?0:1;
  try{await Promise.all(['ember-reliquary','wayfarer-condenser'].map(id=>loadAsset(id,next)));lod=next;showModels();}
  finally{e.target.disabled=false;e.target.textContent=lod?'LOD 1 · Battlefield':'LOD 0 · Detail';e.target.setAttribute('aria-pressed',!!lod);}
});
document.querySelector('#pulse').addEventListener('click',()=>{
  pulseTime=visualTime;
  for(const id of ['ember-reliquary','wayfarer-condenser']){
    const key=activeKey(id),model=models.get(key);if(!model?.visible)continue;
    const clip=model.userData.clips.find(c=>c.name==='Fire'||c.name==='Pulse');if(!clip)continue;
    instances.get(key).playEffect(clip.name);
  }
});
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h')document.body.classList.toggle('hide-ui');});
controls.addEventListener('start',()=>transition=null);
function resize(){camera.aspect=innerWidth/innerHeight;camera.setViewOffset(innerWidth,innerHeight,innerWidth>700?innerWidth*.065:0,innerHeight*.05,innerWidth,innerHeight);camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);}
addEventListener('resize',resize);resize();
// Sparse sparks are a viewer-only effect, kept separate from gameplay simulation.
const sparkCount=45,sparkPositions=new Float32Array(sparkCount*3);const sparkGeo=new THREE.BufferGeometry();sparkGeo.setAttribute('position',new THREE.BufferAttribute(sparkPositions,3));
const sparks=new THREE.Points(sparkGeo,new THREE.PointsMaterial({color:'#ffad4d',size:.018,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(sparks);
const coreLight=new THREE.PointLight('#ff6415',5.0,4,2);scene.add(coreLight);
const aetherLight=new THREE.PointLight('#40ead7',2.0,2.8,2);scene.add(aetherLight);
renderer.setAnimationLoop(()=>{
  const dt=Math.min(clock.getDelta(),.05);if(motion)visualTime+=dt;const t=visualTime;
  if(motion)for(const [key,mixer] of mixers)if(models.get(key).visible)mixer.update(dt);
  if(transition){const a=Math.min(1,(performance.now()-transition.start)/850),ease=a*a*(3-2*a);camera.position.lerpVectors(transition.fromPosition,transition.position,ease);controls.target.lerpVectors(transition.fromTarget,transition.target,ease);if(a===1)transition=null;}
  controls.update();
  const ember=models.get(activeKey('ember-reliquary'));sparks.visible=coreLight.visible=!!ember?.visible;
  if(ember?.visible){coreLight.position.set(ember.position.x,3.31,ember.position.z);sparks.position.copy(ember.position);
    for(let i=0;i<sparkCount;i++){const u=(t*.14+i*.618)%1,a=i*2.399+t*.3;sparkPositions[i*3]=Math.cos(a)*(.17+u*.4);sparkPositions[i*3+1]=3.18+u*1.37;sparkPositions[i*3+2]=Math.sin(a)*(.17+u*.4);}
    sparkGeo.attributes.position.needsUpdate=true;
  }
  const cond=models.get(activeKey('wayfarer-condenser'));aetherLight.visible=!!cond?.visible;if(cond)aetherLight.position.set(cond.position.x,1.5,cond.position.z);
  const p=t-pulseTime,power=p>=0&&p<1.4?1+3.6*Math.sin(Math.PI*p/1.4)**4:1;
  coreLight.intensity=5*power;aetherLight.intensity=2*power;
  for(const model of models.values())if(model.visible)for(const [mat,original] of model.userData.originalEmission)mat.emissiveIntensity=original*power;
  composer.render();
});
try{
  for(const id of ids){await loadAsset(id,modelLOD(id));document.querySelector('#progress').textContent=`${++loadCount} of ${ids.length} assets ready`;}
  showModels();framing('orbit');const loading=document.querySelector('#loading');loading.style.opacity=0;setTimeout(()=>loading.remove(),750);
  // Read-only public diagnostics for the handoff and runtime QA.
  window.assetViewer={get state(){return{asset:current,lod,motion,wireframe,models:[...manifest.entries()].map(([id,s])=>({id,...s})),renderer:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures}};},setAsset,setView};
}catch(error){document.querySelector('#progress').textContent='Could not open a model. Start OPEN-PREVIEW.cmd and reload.';console.error(error);}
