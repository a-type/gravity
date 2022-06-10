import * as THREE from 'three';
import { changed, compose, makeEffect, makeSystem } from '0g';
import {
  Camera,
  CameraConfig,
  GltfModel,
  Object3D,
  PointLightConfig,
  SkyBox,
  TestCube,
} from './components';
import { GLTFResult } from './assets';
import { Transform } from '../rapier/components';

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

const loadSkyBoxEffect = makeEffect([SkyBox], function* (entity, game) {
  const { path } = entity.get(SkyBox);
  const res: any = yield game.assets.load('cubeTexture', path);
  const scene = yield game.globals.load('scene');
  scene.background = res;
});

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

const objectTransformSystem = makeSystem(
  [Object3D, changed(Transform)],
  function (entity, game) {
    const { value: obj3d } = entity.get(Object3D);
    const { position, rotation } = entity.get(Transform);
    obj3d.position.set(position.x, position.y, position.z);
    obj3d.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
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
  createTestCubeEffect,
  addMeshesToSceneEffect,
  manageCameraEffect,
  managePointLightsEffect,
  renderSceneSystem,
  objectTransformSystem,
);
