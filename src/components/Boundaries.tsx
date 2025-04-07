import { useEffect } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useThree, useFrame } from '@react-three/fiber';

interface BoundariesProps {
    size?: number;
    wallHeight?: number;
    wallThickness?: number;
    debugMode?: boolean;
}

export default function Boundaries({
    size = 100,
    wallHeight = 1,
    wallThickness = 0,
    debugMode = true,
}: BoundariesProps) {
    const { camera } = useThree();

    // Get the size parameters
    const halfSize = size / 2;
    const halfWallThickness = wallThickness / 2;
    const halfWallHeight = wallHeight / 2;

    // Add a buffer to ensure walls overlap at corners
    const overlapBuffer = 0;

    // Calculate positions for walls - explicitly typed as [number, number, number] tuples
    const positions: Record<string, [number, number, number]> = {
        // north: [0, halfWallHeight, halfSize + halfWallThickness],
        north: [0, 50, 50],
        // south: [0, halfWallHeight, -halfSize - halfWallThickness],
        south: [0, 50, -50],
        east: [halfSize, halfWallHeight, 0],
        // east: [50, 50, 50],
        // west: [-halfSize - halfWallThickness, halfWallHeight, 0],
        west: [-50, 50, 0],
    };

    // Calculate sizes for walls - explicitly typed
    const sizes: {
        northSouth: [number, number, number];
        eastWest: [number, number, number];
    } = {
        northSouth: [halfSize * 2 + overlapBuffer, wallHeight, wallThickness],
        eastWest: [wallThickness, wallHeight, halfSize * 2 + overlapBuffer],
    };

    // Log positions and sizes for debugging
    useEffect(() => {
        if (debugMode) {
            console.log('Boundary walls created with:');
            console.log('- Ground size:', size, 'x', size);
            console.log('- Wall height:', wallHeight);
            console.log('- Wall thickness:', wallThickness);
            console.log('- Wall positions:', positions);
            console.log('- Wall sizes:', sizes);
        }
    }, [size, wallHeight, wallThickness, debugMode, positions, sizes]);

    // Monitor player position for debugging
    useFrame(() => {
        if (debugMode && camera) {
            if (Math.floor(Date.now() / 3000) % 2 === 0) {
                console.log(
                    'Player position:',
                    camera.position.x.toFixed(2),
                    camera.position.y.toFixed(2),
                    camera.position.z.toFixed(2),
                    '| Distance to edge X:',
                    (halfSize - Math.abs(camera.position.x)).toFixed(2),
                    '| Distance to edge Z:',
                    (halfSize - Math.abs(camera.position.z)).toFixed(2)
                );
            }
        }
    });

    return (
        <>
            {/* North wall */}
            <RigidBody
                type="fixed"
                position={positions.north}
                restitution={0.2}
                name="northWall"
            >
                <CuboidCollider
                    args={[
                        halfSize + overlapBuffer / 2,
                        halfWallHeight,
                        halfWallThickness,
                    ]}
                />
                {debugMode && (
                    <mesh>
                        <boxGeometry
                            args={[
                                size + overlapBuffer,
                                wallHeight,
                                wallThickness,
                            ]}
                        />
                        <meshStandardMaterial
                            color="red"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>

            {/* South wall */}
            <RigidBody
                type="fixed"
                position={positions.south}
                restitution={0.2}
                name="southWall"
            >
                <CuboidCollider
                    args={[
                        halfSize + overlapBuffer / 2,
                        halfWallHeight,
                        halfWallThickness,
                    ]}
                />
                {debugMode && (
                    <mesh>
                        <boxGeometry
                            args={[
                                size + overlapBuffer,
                                wallHeight,
                                wallThickness,
                            ]}
                        />
                        <meshStandardMaterial
                            color="blue"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>

            {/* East wall */}
            <RigidBody
                type="fixed"
                position={positions.east}
                restitution={0.2}
                name="eastWall"
            >
                <CuboidCollider
                    args={[
                        halfWallThickness,
                        halfWallHeight,
                        halfSize + overlapBuffer / 2,
                    ]}
                />
                {debugMode && (
                    <mesh>
                        <boxGeometry
                            args={[
                                wallThickness,
                                wallHeight,
                                size + overlapBuffer,
                            ]}
                        />
                        <meshStandardMaterial
                            color="green"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>

            {/* West wall */}
            <RigidBody
                type="fixed"
                position={positions.west}
                restitution={0.2}
                name="westWall"
            >
                <CuboidCollider
                    args={[
                        halfWallThickness,
                        halfWallHeight,
                        halfSize + overlapBuffer / 2,
                    ]}
                />
                {debugMode && (
                    <mesh>
                        <boxGeometry
                            args={[
                                wallThickness,
                                wallHeight,
                                size + overlapBuffer,
                            ]}
                        />
                        <meshStandardMaterial
                            color="yellow"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>

            {/* Corner colliders for extra protection */}
            {/* Northeast corner */}
            <RigidBody
                type="fixed"
                position={[
                    halfSize + halfWallThickness,
                    halfWallHeight,
                    halfSize + halfWallThickness,
                ]}
                restitution={0.2}
                name="northEastCorner"
            >
                <CuboidCollider
                    args={[
                        halfWallThickness,
                        halfWallHeight,
                        halfWallThickness,
                    ]}
                />
                {debugMode && (
                    <mesh>
                        <boxGeometry
                            args={[wallThickness, wallHeight, wallThickness]}
                        />
                        <meshStandardMaterial
                            color="orange"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>

            {/* Northwest corner */}
            <RigidBody
                type="fixed"
                position={[
                    -halfSize - halfWallThickness,
                    halfWallHeight,
                    halfSize + halfWallThickness,
                ]}
                restitution={0.2}
                name="northWestCorner"
            >
                <CuboidCollider
                    args={[
                        halfWallThickness,
                        halfWallHeight,
                        halfWallThickness,
                    ]}
                />
                {debugMode && (
                    <mesh>
                        <boxGeometry
                            args={[wallThickness, wallHeight, wallThickness]}
                        />
                        <meshStandardMaterial
                            color="orange"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>

            {/* Southeast corner */}
            <RigidBody
                type="fixed"
                position={[
                    halfSize + halfWallThickness,
                    halfWallHeight,
                    -halfSize - halfWallThickness,
                ]}
                restitution={0.2}
                name="southEastCorner"
            >
                <CuboidCollider
                    args={[
                        halfWallThickness,
                        halfWallHeight,
                        halfWallThickness,
                    ]}
                />
                {debugMode && (
                    <mesh>
                        <boxGeometry
                            args={[wallThickness, wallHeight, wallThickness]}
                        />
                        <meshStandardMaterial
                            color="orange"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>

            {/* Southwest corner */}
            <RigidBody
                type="fixed"
                position={[
                    -halfSize - halfWallThickness,
                    halfWallHeight,
                    -halfSize - halfWallThickness,
                ]}
                restitution={0.2}
                name="southWestCorner"
            >
                <CuboidCollider
                    args={[
                        halfWallThickness,
                        halfWallHeight,
                        halfWallThickness,
                    ]}
                />
                {debugMode && (
                    <mesh>
                        <boxGeometry
                            args={[wallThickness, wallHeight, wallThickness]}
                        />
                        <meshStandardMaterial
                            color="orange"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>

            {/* Bottom to catch falls - positioned below ground */}
            <RigidBody
                type="fixed"
                position={[0, -10, 0]}
                restitution={0.5}
                name="safetyFloor"
            >
                <CuboidCollider args={[halfSize * 1.2, 1, halfSize * 1.2]} />
                {debugMode && (
                    <mesh>
                        <boxGeometry args={[size * 1.2, 2, size * 1.2]} />
                        <meshStandardMaterial
                            color="purple"
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}
            </RigidBody>
        </>
    );
}
