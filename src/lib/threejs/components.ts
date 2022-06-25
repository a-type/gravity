import { Component, State } from '0g';
import * as THREE from 'three';

export class Object3D extends State(() => ({
  value: null as unknown as THREE.Object3D,
})) {}

export class TestCube extends Component(() => ({
  color: 0xffffff,
  size: 1,
})) {}

export class GltfModel extends Component(() => ({
  path: '',
})) {}

export class SkyBox extends Component(() => ({
  path: '',
})) {}

export class HeightmapTerrain extends Component(() => ({
  path: '',
})) {}

export class OrbitControls extends Component(() => ({})) {}

export class CameraConfig extends Component(() => ({
  kind: 'perspective' as 'perspective' | 'orthographic',
  fov: 50,
  aspect: 1,
  near: 0.1,
  far: 1000,
  left: 0,
  right: 1,
  top: 0,
  bottom: 1,
  isMain: true,
})) {}

export class Camera extends State(() => ({
  value: null as unknown as THREE.Camera,
})) {}

export class PointLightConfig extends Component(() => ({
  color: 0xffffff,
  intensity: 1,
  distance: 0,
  decay: 1,
})) {}
