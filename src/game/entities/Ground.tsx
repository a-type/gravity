import { Tag } from 'miniplex';
import { BoxCollider, collisions, RigidBody } from '../../lib/physics3d';
import { ECS } from '../ecs';
import { Layers } from '../Layers';
import { Plane } from '@react-three/drei';

export const Ground = () => {
  return (
    <ECS.Entity>
      <ECS.Component name="isGround" data={Tag} />

      <ECS.Component name="transform">
        <RigidBody
          position-y={-2}
          rotation-x={-Math.PI / 2}
          lockRotations
          lockTranslations
          gravityScale={0}
        >
          <BoxCollider
            collisionGroups={collisions(Layers.Terrain, Layers.Player)}
            args={[1000, 1000, 1]}
          >
            <Plane args={[1000, 1000]}>
              <meshBasicMaterial color="#a0a0a0" />
            </Plane>
          </BoxCollider>
        </RigidBody>
      </ECS.Component>
    </ECS.Entity>
  );
};
