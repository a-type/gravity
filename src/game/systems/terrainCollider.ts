import { makeEffect } from '0g';
import { Body, Colliders } from '../../lib/rapier/components';
import { HeightmapTerrain } from '../../lib/threejs/components';
import type R from '@dimforge/rapier3d-compat';

export const createTerrainColliderEffect = makeEffect(
  [HeightmapTerrain, Body],
  function* (entity, game) {
    const { path } = entity.get(HeightmapTerrain);
    const { value: body } = entity.get(Body);
    const {
      heights,
      texture,
    }: {
      texture: THREE.Texture;
      heights: Float32Array;
    } = yield game.assets.load('heightmap', path);
    const Rapier: typeof R = yield game.globals.load('Rapier');
    console.log(texture.image.height, texture.image.width, heights);
    const colliderDesc = Rapier.ColliderDesc.heightfield(
      texture.image.height,
      texture.image.width,
      heights,
      { x: 1, y: 1, z: 1 },
    );
    const world: R.World = yield game.globals.load('physicsWorld');
    const collider = world.createCollider(colliderDesc, body.handle);
    game.add(entity.id, Colliders, {
      value: [collider],
    });
  },
  function* (entity, game) {
    const { value: body } = entity.get(Body);
    const colliders = entity.get(Colliders);
    if (!colliders) return;
    const world: R.World = yield game.globals.load('physicsWorld');
    world.removeCollider(colliders.value[0], true);
    game.remove(entity.id, Colliders);
  },
);

export const systems = createTerrainColliderEffect;
