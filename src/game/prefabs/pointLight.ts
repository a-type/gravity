import { Game } from '0g';
import { Transform } from '../../lib/rapier/components';
import { PointLightConfig } from '../../lib/threejs/components';

export function pointLightPrefab(game: Game) {
  const light = game.create();
  game.add(light, PointLightConfig, {
    intensity: 2,
    distance: 100,
    decay: 0,
  });
  game.add(light, Transform, {
    position: { x: 2, y: 5, z: 1 },
  });
}
