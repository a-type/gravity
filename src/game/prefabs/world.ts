import { Game } from '0g';
import { Transform, WorldConfig } from '../../lib/rapier/components';
import { SkyBox, TestCube } from '../../lib/threejs/components';

export function worldPrefab(game: Game) {
  const world = game.create();
  game.add(world, WorldConfig, {});

  // const testCube = game.create();
  // game.add(testCube, TestCube);
  // game.add(testCube, Transform);

  const skyBox = game.create();
  game.add(skyBox, SkyBox, { path: '/textures/skybox' });
}
