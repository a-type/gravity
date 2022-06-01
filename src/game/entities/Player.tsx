import { Tag } from 'miniplex';
import { CapsuleCollider, collisions, RigidBody } from '../../lib/physics3d';
import { ECS } from '../ecs';
import { Layers } from '../Layers';
import { RoundedBox } from '@react-three/drei';
import Character from '../models/Character';

export const Player = () => {
  return (
    <ECS.Entity>
      <ECS.Component name="isPlayer" data={Tag} />

      <ECS.Component name="transform">
        <RigidBody position-z={0} lockRotations>
          <CapsuleCollider
            collisionGroups={collisions(Layers.Player, Layers.Terrain)}
          >
            {/* <RoundedBox args={[1, 2.5, 1]} radius={0.5} /> */}
            <ECS.Component name="animation" data="standing_idle">
              <Character scale={[1.5, 1.5, 1.5]} position={[0, -1.25, 0]} />
            </ECS.Component>
          </CapsuleCollider>
        </RigidBody>
      </ECS.Component>
    </ECS.Entity>
  );
};
