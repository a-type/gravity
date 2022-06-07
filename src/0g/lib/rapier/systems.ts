import { changed, compose, Game, makeEffect, makeSystem } from '0g';
import type R from '@dimforge/rapier3d-compat';
import {
  Body,
  BodyConfig,
  ColliderInfo,
  Colliders,
  CollidersConfig,
  Transform,
  WorldConfig,
} from './components';

declare module '0g' {
  interface Globals {
    physicsWorld: R.World;
    Rapier: typeof R;
  }
}

const manageWorldsEffect = makeEffect(
  [WorldConfig],
  function* (entity, game) {
    const config = entity.get(WorldConfig);
    const Rapier: typeof R = yield game.globals.load('Rapier');
    const world = new Rapier.World(config.gravity);
    game.globals.resolve('physicsWorld', world);
  },
  (_, game) => {
    game.globals.remove('physicsWorld');
  },
);

const manageBodiesEffect = makeEffect(
  [BodyConfig, Transform],
  function* (entity, game) {
    const bodyConfig = entity.get(BodyConfig);
    const transform = entity.get(Transform);

    const Rapier: typeof R = yield game.globals.load('Rapier');
    const desc = new Rapier.RigidBodyDesc(bodyConfig.kind)
      .setCanSleep(bodyConfig.canSleep)
      .setTranslation(
        bodyConfig.initialTranslation.x,
        bodyConfig.initialTranslation.y,
        bodyConfig.initialTranslation.z,
      )
      .setRotation(bodyConfig.initialRotation)
      .setGravityScale(bodyConfig.gravityScale)
      .setCcdEnabled(bodyConfig.ccdEnabled);

    const world: R.World = yield game.globals.load('physicsWorld');

    const b = world.createRigidBody(desc);

    game.add(entity.id, Body, { value: b });
  },
  function* (entity, game) {
    const body = entity.get(Body);
    if (!body) return;
    const world: R.World = yield game.globals.load('physicsWorld');
    world.removeRigidBody(body.value);
  },
);

function colliderInfoToDesc(colliderInfo: ColliderInfo, Rapier: typeof R) {
  let desc: R.ColliderDesc | null = null;
  switch (colliderInfo.shape) {
    case 'ball':
      desc = Rapier.ColliderDesc.ball(colliderInfo.radius);
      break;
    case 'cuboid':
      desc = Rapier.ColliderDesc.cuboid(
        colliderInfo.width,
        colliderInfo.height,
        colliderInfo.depth,
      );
      break;
    case 'capsule':
      desc = Rapier.ColliderDesc.capsule(
        colliderInfo.halfHeight,
        colliderInfo.radius,
      );
      break;
    case 'trimesh':
      desc = Rapier.ColliderDesc.trimesh(
        colliderInfo.vertices,
        colliderInfo.indices,
      );
      break;
    case 'heightfield':
      desc = Rapier.ColliderDesc.heightfield(
        colliderInfo.rows,
        colliderInfo.columns,
        colliderInfo.heights,
        colliderInfo.scale,
      );
      break;
    case 'convexHull':
      desc = Rapier.ColliderDesc.convexHull(colliderInfo.points);
      break;
  }
  if (!desc) {
    throw new Error('Invalid collider configuration');
  }
  desc
    .setDensity(colliderInfo.density)
    .setFriction(colliderInfo.friction)
    .setRestitution(colliderInfo.restitution)
    .setRotation(colliderInfo.rotation)
    .setSensor(colliderInfo.isSensor)
    .setTranslation(
      colliderInfo.translation.x,
      colliderInfo.translation.y,
      colliderInfo.translation.z,
    );
  return desc;
}

const manageCollidersEffect = makeEffect(
  [Body, CollidersConfig],
  function* (entity, game) {
    const body = entity.get(Body);
    const colliders = entity.get(CollidersConfig);
    const Rapier: typeof R = yield game.globals.load('Rapier');
    const world: R.World = yield game.globals.load('physicsWorld');
    const colliderList = new Array<R.Collider>();
    for (const colliderInfo of colliders.colliders) {
      colliderList.push(
        world.createCollider(
          colliderInfoToDesc(colliderInfo, Rapier),
          body.value.handle,
        ),
      );
    }
    game.add(entity.id, Colliders, { value: colliderList });
  },
  function* (entity, game) {
    const body = entity.get(Body);
    if (!body) return;
    const colliders = entity.get(Colliders);
    if (!colliders) return;
    const world: R.World = yield game.globals.load('physicsWorld');
    for (const collider of colliders.value) {
      world.removeCollider(collider, true);
    }
  },
);

const updateBodiesSystem = makeSystem([changed(BodyConfig), Body], (entity) => {
  const body = entity.get(Body);
  if (!body) return;
  const bodyConfig = entity.get(BodyConfig);
  body.value.setGravityScale(bodyConfig.gravityScale, true);
});

const stepWorldRunner = (game: Game) => {
  let simulate: () => void;
  game.globals.load('physicsWorld').then((world) => {
    simulate = () => {
      world.step();
    };
    game.on('step', simulate);
  });

  return () => {
    game.off('step', simulate);
  };
};

const updateTransformsSystem = makeSystem([Body, Transform], (entity) => {
  const body = entity.get(Body);
  if (!body) return;
  const transform = entity.get(Transform);
  const pos = body.value.translation();
  const rot = body.value.rotation();
  transform.position.x = pos.x;
  transform.position.y = pos.y;
  transform.position.z = pos.z;
  transform.rotation.x = rot.x;
  transform.rotation.y = rot.y;
  transform.rotation.z = rot.z;
  transform.rotation.w = rot.w;
  transform.updated = true;
});

export const systems = compose(
  manageWorldsEffect,
  // manageBodiesEffect,
  // manageCollidersEffect,
  // updateBodiesSystem,
  // updateTransformsSystem,
  stepWorldRunner,
);
