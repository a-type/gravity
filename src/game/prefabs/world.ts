import { Game } from '0g';
import {
  BodyConfig,
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
}
