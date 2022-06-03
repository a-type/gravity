import { Component, State } from '0g';
import type R from '@dimforge/rapier3d-compat';

export class Transform extends Component(() => ({
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0,
    w: 1,
  },
})) {}

export class BodyConfig extends Component(() => ({
  kind: 0 as R.RigidBodyType,
  initialTranslation: { x: 0, y: 0, z: 0 },
  initialRotation: { x: 0, y: 0, z: 0, w: 1 },
  gravityScale: 1,
  canSleep: true,
  ccdEnabled: false,
})) {}

export type ColliderInfo = {
  density: number;
  friction: number;
  restitution: number;
  translation: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  isSensor: boolean;
} & (
  | {
      shape: 'ball';
      radius: number;
    }
  | {
      shape: 'cuboid';
      width: number;
      height: number;
      depth: number;
    }
  | {
      shape: 'capsule';
      halfHeight: number;
      radius: number;
    }
  | {
      shape: 'trimesh';
      vertices: Float32Array;
      indices: Uint32Array;
    }
  | {
      shape: 'heightfield';
      rows: number;
      columns: number;
      heights: Float32Array;
      scale: { x: number; y: number; z: number };
    }
  | {
      shape: 'convexHull';
      points: Float32Array;
    }
);

export class CollidersConfig extends Component(() => ({
  colliders: new Array<ColliderInfo>(),
})) {}

export class Body extends State(() => ({
  value: null as unknown as R.RigidBody,
})) {}

export class Colliders extends State(() => ({
  value: new Array<R.Collider>(),
})) {}

export class WorldConfig extends Component(() => ({
  gravity: { x: 0, y: 0, z: 0 },
})) {}
