import { Game } from '0g';
import {
  BodyConfig,
  CollidersConfig,
  Transform,
  WorldConfig,
} from '../../lib/rapier/components';
import {
  HeightmapTerrain,
  SkyBox,
  TestCube,
} from '../../lib/threejs/components';

export function worldPrefab(game: Game) {
  const world = game.create();
  game.add(world, WorldConfig, {
    gravity: { x: 0, y: -9.8, z: 0 },
  });

  // const testCube = game.create();
  // game.add(testCube, TestCube);
  // game.add(testCube, Transform);

  const skyBox = game.create();
  game.add(skyBox, SkyBox, { path: '/textures/skybox' });

  const heightMap = game.create();
  game.add(heightMap, HeightmapTerrain, {
    path: '/textures/heightmaps/example.png',
  });
  game.add(heightMap, Transform, {
    position: { x: 0, y: -10, z: 0 },
  });
  game.add(heightMap, BodyConfig, {
    kind: 1,
  });

  testCube(game, { x: 0, y: 10, z: 0 });
  testCube(game, { x: 0, y: 10, z: 2 });
  testCube(game, { x: 0, y: 10, z: 4 });
  testCube(game, { x: 0, y: 10, z: 6 });
}

function testCube(game: Game, position: { x: number; y: number; z: number }) {
  const testCube = game.create();
  game.add(testCube, TestCube);
  game.add(testCube, Transform, {
    position,
  });
  game.add(testCube, BodyConfig, {
    kind: 0,
    gravityScale: 1,
    initialTranslation: position,
  });
  game.add(testCube, CollidersConfig, {
    colliders: [
      {
        shape: 'cuboid',
        depth: 1,
        height: 1,
        width: 1,
        density: 1,
        friction: 0.5,
        isSensor: false,
        restitution: 0.5,
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        translation: { x: 0, y: 0, z: 0 },
      },
    ],
  });
}
