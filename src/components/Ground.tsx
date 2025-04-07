import { RigidBody } from '@react-three/rapier';

export default function Ground() {
    return (
        <RigidBody type="fixed" colliders="cuboid" friction={1}>
            <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                {/* Optional: Add a reflective material */}
                {/* <MeshReflectorMaterial
                    resolution={512}
                    blur={[1000, 1000]}
                    mixBlur={1}
                    mirror={0.5}
                    color="#888888"
                /> */}
                 <meshStandardMaterial color="#444444" />
            </mesh>
        </RigidBody>
    );
}
