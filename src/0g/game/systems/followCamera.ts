import { compose, makeEffect, makeSystem } from '0g';
import { Vector3 } from 'three';
import { components as threeComponents } from '../../lib/threejs';
import {
  FollowCameraTarget,
  FollowCamera,
  FollowCameraTargetRef,
} from '../components/camera';

const manageFollowCameraTargetEffect = makeEffect(
  [FollowCameraTarget, threeComponents.Object3D],
  function* (entity, game) {
    // find the follow camera(s?) and set the target
    const mesh = entity.get(threeComponents.Object3D);
    game.query([FollowCamera], function (cameraEntity) {
      const target = cameraEntity.get(FollowCameraTargetRef);
      if (!target) {
        game.add(cameraEntity.id, FollowCameraTargetRef, {
          target: mesh.value,
        });
      } else {
        target.target = mesh.value;
        target.updated = true;
      }
    });
  },
  function* (entity, game) {
    game.query([FollowCamera], function (cameraEntity) {
      const target = cameraEntity.get(FollowCameraTargetRef);
      if (target) {
        target.target = null;
        target.updated = true;
      }
    });
  },
);

let tmpVector3 = new Vector3();
const doFollowCameraSystem = makeSystem(
  [threeComponents.Camera, FollowCamera, FollowCameraTargetRef],
  function (entity, game) {
    const { target } = entity.get(FollowCameraTargetRef);
    if (target) {
      const { value: camera } = entity.get(threeComponents.Camera);
      const t = tmpVector3
        .set(0, 2, 15)
        .applyQuaternion(target.quaternion)
        .add(target.position);

      // camera.position.lerp(t, 0.05);
      camera.position.copy(t);

      // camera.quaternion.slerp(target.quaternion, 0.05);
      camera.quaternion.copy(target.quaternion);
    }
  },
  'postStep',
);

export const systems = compose(
  manageFollowCameraTargetEffect,
  doFollowCameraSystem,
);
