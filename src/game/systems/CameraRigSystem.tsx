import { Controller, processors, VectorControl } from '@hmans/controlfreak';
import { FC, useEffect, useMemo } from 'react';
import { Vector3 } from 'three';
import { MouseDevice } from '../../lib/control/MouseDevice';
import { useTickerFrame } from '../../lib/tickle';
import { ECS } from '../ecs';
import { Update } from '../Update';

const tmpVector3 = new Vector3();

export const CameraRigSystem: FC = () => {
  const player = ECS.useArchetype('isPlayer').first;
  const camera = ECS.useArchetype('isCamera').first;

  useTickerFrame(() => {
    if (!player || !camera) return;

    const target = tmpVector3
      .set(0, 2, 15)
      .applyQuaternion(player.transform.quaternion)
      .add(player.transform.position);

    camera.transform.position.lerp(target, 0.05);
    camera.transform.quaternion.slerp(player.transform.quaternion, 0.05);
  }, Update.Late);

  return null;
};

const useController = () => {
  const controller = useMemo(createController, []);

  useEffect(() => {
    controller.start();
    return () => controller.stop();
  }, [controller]);

  return controller;
};

const createController = () => {
  const controller = new Controller();
  const mouse = new MouseDevice();

  controller.addDevice(mouse);

  controller
    .addControl('move', VectorControl)
    .addStep(mouse.velocityVector)
    .addStep(processors.clampVector(100))
    .addStep(processors.deadzone(15));

  return controller;
};
