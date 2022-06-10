import { Game } from '0g';
import { Quaternion } from 'three';
import { Transform } from '../../lib/rapier/components';
import { CameraConfig } from '../../lib/threejs/components';
import { FollowCamera } from '../components';

export function cameraPrefab(game: Game) {
  const id = game.create();
  game.add(id, CameraConfig, {
    kind: 'perspective',
    fov: 45,
    isMain: true,
  });
  game.add(id, Transform, {
    position: { x: 0, y: 0, z: 0 },
  });
  game.add(id, FollowCamera, {});
}
