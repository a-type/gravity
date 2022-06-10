import * as THREE from 'three';
import * as THREE_STD from 'three-stdlib';
import { changed, compose, makeEffect, makeSystem } from '0g';
import {
  Camera,
  CameraConfig,
  GltfModel,
  HeightmapTerrain,
  Object3D,
  OrbitControls,
  PointLightConfig,
  SkyBox,
  TestCube,
} from './components';
import { GLTFResult } from './assets';
import { Body, Transform } from '../rapier/components';

const loadGltfModelEffect = makeEffect(
  [GltfModel],
  function* (entity, game) {
    const { path } = entity.get(GltfModel);
    const res: GLTFResult = yield game.assets.load('.gltf', path);
    game.add(entity.id, Object3D, { value: res.scene });
  },
  function* (entity, game) {
    game.remove(entity.id, Object3D);
  },
);

const loadSkyBoxEffect = makeEffect(
  [SkyBox],
  function* (entity, game) {
    const { path } = entity.get(SkyBox);
    const res: any = yield game.assets.load('cubeTexture', path);
    const scene = yield game.globals.load('scene');
    scene.background = res;
  },
  function* (entity, game) {
    const scene = game.globals.immediate('scene')!;
    scene.background = null;
  },
);

const loadHeightmapTerrainEffect = makeEffect(
  [HeightmapTerrain],
  function* (entity, game) {
    const { path } = entity.get(HeightmapTerrain);
    const {
      texture,
      heights,
    }: { texture: THREE.Texture; heights: Float32Array } =
      yield game.assets.load('heightmap', path);
    const geometry = new THREE.PlaneBufferGeometry(
      texture.image.width,
      texture.image.height,
      texture.image.width - 1,
      texture.image.height - 1,
    );
    for (let i = 0; i < heights.length; i++) {
      geometry.attributes.position.setZ(i / 4, heights[i] / 10);
    }
    geometry.attributes.position.needsUpdate = true;
    const terrain = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      }),
    );
    terrain.position.set(0, 0, 0);
    terrain.quaternion.setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      -Math.PI / 2,
    );
    terrain.scale.set(1, 1, 1);
    const group = new THREE.Group();
    group.add(terrain);
    game.add(entity.id, Object3D, { value: group });
  },
  function* (entity, game) {
    game.remove(entity.id, Object3D);
  },
);

const createOrbitControlsEffect = makeEffect(
  [OrbitControls, Camera],
  function* (entity, game) {
    const { value: camera } = entity.get(Camera);
    const controls = new THREE_STD.OrbitControls(
      camera,
      game.globals.immediate('renderer')!.domElement,
    );
    return function* () {
      controls.dispose();
    };
  },
);

const createTestCubeEffect = makeEffect(
  [TestCube],
  function* (entity, game) {
    const { color, size } = entity.get(TestCube);
    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(size, size, size),
      new THREE.MeshBasicMaterial({ color }),
    );
    game.add(entity.id, Object3D, { value: cube });
  },
  function* (entity, game) {
    game.remove(entity.id, Object3D);
  },
);

const addMeshesToSceneEffect = makeEffect(
  [Object3D],
  function* (entity, game) {
    const { value: mesh } = entity.get(Object3D);
    game.globals.immediate('scene')!.add(mesh);
  },
  function* (entity, game) {
    const { value: mesh } = entity.get(Object3D);
    game.globals.immediate('scene')!.remove(mesh);
  },
);

const initializeMeshTransformEffect = makeEffect(
  [Object3D, Transform],
  function* (entity, game) {
    const { value: mesh } = entity.get(Object3D);
    const { position, rotation } = entity.get(Transform);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  },
);

const manageCameraEffect = makeEffect(
  [CameraConfig],
  function* (entity, game) {
    const { kind, fov, near, far, left, right, top, bottom, aspect } =
      entity.get(CameraConfig);
    const camera =
      kind === 'perspective'
        ? new THREE.PerspectiveCamera(fov, aspect, near, far)
        : new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    game.add(entity.id, Camera, { value: camera });
    game.add(entity.id, Object3D, { value: camera });
  },
  function* (entity, game) {
    game.remove(entity.id, Camera);
    game.remove(entity.id, Object3D);
  },
);

const managePointLightsEffect = makeEffect(
  [PointLightConfig],
  function* (entity, game) {
    const { color } = entity.get(PointLightConfig);
    const light = new THREE.PointLight(color);
    game.globals.immediate('scene')!.add(light);
    game.add(entity.id, Object3D, { value: light });
  },
  function* (entity, game) {
    const pointLight = entity.get(Object3D);
    if (!pointLight) return;
    game.remove(entity.id, Object3D);
  },
);

let tmpVector3;
let tmpQuaternion;
const bodyMovementSystem = makeSystem(
  [Object3D, Body],
  function (entity, game) {
    const { value: obj3d } = entity.get(Object3D);
    const { value: body } = entity.get(Body);
    tmpVector3 = body.translation();
    tmpQuaternion = body.rotation();
    obj3d.position.set(tmpVector3.x, tmpVector3.y, tmpVector3.z);
    obj3d.quaternion.set(
      tmpQuaternion.x,
      tmpQuaternion.y,
      tmpQuaternion.z,
      tmpQuaternion.w,
    );
  },
);

const renderSceneSystem = makeSystem([Camera], function (entity, game) {
  const { value: camera } = entity.get(Camera);
  const config = entity.get(CameraConfig);
  if (config?.isMain) {
    game.globals
      .immediate('renderer')!
      .render(game.globals.immediate('scene')!, camera);
  }
});

export const systems = compose(
  loadGltfModelEffect,
  loadSkyBoxEffect,
  loadHeightmapTerrainEffect,
  initializeMeshTransformEffect,
  createOrbitControlsEffect,
  createTestCubeEffect,
  addMeshesToSceneEffect,
  manageCameraEffect,
  managePointLightsEffect,
  renderSceneSystem,
  bodyMovementSystem,
);
