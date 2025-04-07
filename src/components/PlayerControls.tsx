import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Vector3, Euler, MathUtils } from 'three';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';

interface PlayerControlsProps {
    speed?: number;
    sprintSpeed?: number;
}

export default function PlayerControls({ speed = 5, sprintSpeed = 10 }: PlayerControlsProps) {
    const { camera, gl } = useThree();
    const [_, get] = useKeyboardControls<string>();
    const playerRef = useRef<RapierRigidBody>(null);
    const currentMoveSpeed = useRef(speed);

    const isDragging = useRef(false);
    const mouseDelta = useRef({ x: 0, y: 0 });
    const rotation = useRef(new Euler(0, 0, 0, 'YXZ'));
    const MOUSE_SENSITIVITY = 0.002;

    useEffect(() => {
        const handleMouseDown = (event: PointerEvent) => {
            if (event.button === 0) {
                isDragging.current = true;
            }
        };

        const handleMouseUp = (event: PointerEvent) => {
            if (event.button === 0) {
                isDragging.current = false;
            }
        };

        const handleMouseMove = (event: PointerEvent) => {
            if (isDragging.current) {
                mouseDelta.current.x += event.movementX;
                mouseDelta.current.y += event.movementY;
            }
        };

        const canvas = gl.domElement;
        canvas.style.cursor = 'default';
        canvas.addEventListener('pointerdown', handleMouseDown);
        canvas.addEventListener('pointerup', handleMouseUp);
        canvas.addEventListener('pointermove', handleMouseMove);

        const handleMouseLeave = () => {
            if (isDragging.current) {
                isDragging.current = false;
            }
        }
        canvas.addEventListener('pointerleave', handleMouseLeave);

        return () => {
            canvas.removeEventListener('pointerdown', handleMouseDown);
            canvas.removeEventListener('pointerup', handleMouseUp);
            canvas.removeEventListener('pointermove', handleMouseMove);
            canvas.removeEventListener('pointerleave', handleMouseLeave);
            canvas.style.cursor = 'default';
        };
    }, [gl]);

    useFrame((_, delta) => {
        if (!playerRef.current) return;
        const playerPosition = playerRef.current.translation();

        if (isDragging.current) {
            rotation.current.y -= mouseDelta.current.x * MOUSE_SENSITIVITY;
            rotation.current.x -= mouseDelta.current.y * MOUSE_SENSITIVITY;
            rotation.current.x = MathUtils.clamp(rotation.current.x, -Math.PI / 2 * 0.9, Math.PI / 2 * 0.9);
            camera.rotation.copy(rotation.current);
            mouseDelta.current = { x: 0, y: 0 };
        }

        camera.position.set(playerPosition.x, playerPosition.y + 0.6, playerPosition.z);

        const { forward, backward, left, right, sprint } = get();
        currentMoveSpeed.current = sprint ? sprintSpeed : speed;

        const direction = new Vector3();
        const frontVector = new Vector3(0, 0, Number(backward) - Number(forward));
        const sideVector = new Vector3(Number(left) - Number(right), 0, 0);

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(currentMoveSpeed.current * delta * 60)
            .applyEuler(camera.rotation);

        const currentLinvel = playerRef.current.linvel();
        playerRef.current.setLinvel({ x: direction.x, y: currentLinvel.y, z: direction.z }, true);
    });

    return (
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
    );
}
