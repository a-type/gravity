import { CameraRigSystem } from './CameraRigSystem';
import { FlushECSQueueSystem } from './FlushECSQueueSystem';
import { LifetimeSystem } from './LifetimeSystem';
import { LogLargeDeltaTimesSystem } from './LogLargeDeltaTimesSystem';
import { MaxLifetimeSystem } from './MaxLifetimeSystem';
import { MovementSystem } from './MovementSystem';
import { PlayerControllerSystem } from './PlayerControllerSystem';

export const Systems = () => (
  <>
    {/* Basic Systems */}
    {/* <LifetimeSystem /> */}
    {/* <MaxLifetimeSystem /> */}

    {/* Gameplay Systems */}
    <PlayerControllerSystem />
    <MovementSystem />
    <CameraRigSystem />

    {/* Administrative & Debugging */}
    {/* <FlushECSQueueSystem /> */}
    {/* <LogLargeDeltaTimesSystem /> */}
  </>
);
