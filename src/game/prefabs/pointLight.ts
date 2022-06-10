import { Game } from '0g';
import { Transform } from '../../lib/rapier/components';
import { PointLightConfig } from '../../lib/threejs/components';

export function pointLightPrefab(game: Game) {
  const light = game.create();
  game.add(light, PointLightConfig, {});
  game.add(light, Transform, {
    position: { x: 2, y: 5, z: 1 },
  });
}
