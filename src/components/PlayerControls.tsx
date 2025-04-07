import { useKeyboardControls, PointerLockControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3, Euler } from 'three';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';

interface PlayerControlsProps {
    speed?: number;
    sprintSpeed?: number;
}

export default function PlayerControls({ speed = 5, sprintSpeed = 10 }: PlayerControlsProps) {
    const { camera } = useThree();
    const [_, get] = useKeyboardControls<string>();
    const playerRef = useRef<RapierRigidBody>(null);
    const currentMoveSpeed = useRef(speed);

    useFrame((_, delta) => {
        if (!playerRef.current) return;
        const playerPosition = playerRef.current.translation();
        camera.position.set(playerPosition.x, playerPosition.y + 0.6, playerPosition.z);

        const { forward, backward, left, right, sprint } = get();
        currentMoveSpeed.current = sprint ? sprintSpeed : speed;

        const direction = new Vector3();
        const frontVector = new Vector3(0, 0, Number(backward) - Number(forward));
        const sideVector = new Vector3(Number(left) - Number(right), 0, 0);
        const cameraRotation = new Euler().copy(camera.rotation);

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(currentMoveSpeed.current * delta * 60)
            .applyEuler(cameraRotation);

        const currentLinvel = playerRef.current.linvel();
        playerRef.current.setLinvel({ x: direction.x, y: currentLinvel.y, z: direction.z }, true);
    });

    return (
        <>
            <RigidBody
                ref={playerRef}
                colliders={false}
                mass={1}
                type="dynamic"
                position={[0, 1, 5]}
                enabledRotations={[false, true, false]}
            >
                <CapsuleCollider args={[0.5, 0.5]} />
            </RigidBody>
            <PointerLockControls />
        </>
    );
}
