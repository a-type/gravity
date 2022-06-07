import { Game } from '0g';
import { FollowCameraTarget } from '../components/camera';
import { components as threeComponents } from '../../lib/threejs';
import { components as rapierComponents } from '../../lib/rapier';
import { Player } from '../components';

export function characterPrefab(game: Game) {
  const character = game.create();
  game.add(character, Player);
  game.add(character, FollowCameraTarget);
  game.add(character, threeComponents.GltfModel, {
    path: '/public/animations/character.glb',
  });
  game.add(character, rapierComponents.BodyConfig, {
    canSleep: true,
    ccdEnabled: true,
    kind: 2,
  });
  game.add(character, rapierComponents.Transform, {
    position: { x: 0, y: 0, z: 0 },
  });
  game.add(character, rapierComponents.CollidersConfig, {
    colliders: [
      {
        shape: 'capsule',
        density: 1,
        friction: 0.5,
        halfHeight: 1,
        radius: 0.5,
        isSensor: false,
        restitution: 0.5,
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        translation: { x: 0, y: 0, z: 0 },
      },
    ],
  });
}
