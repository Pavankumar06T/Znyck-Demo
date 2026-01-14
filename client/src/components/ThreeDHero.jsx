import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';

const SimpleSphere = () => {
    const mesh = useRef();
    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Sphere ref={mesh} args={[1, 32, 32]} scale={2}>
            <MeshDistortMaterial
                color="#4338ca"
                attach="material"
                distort={0.4}
                speed={2}
            />
        </Sphere>
    );
};

const ThreeDHero = () => {
    return (
        <div className="h-[400px] w-full">
            {/* Reduced complexity to fix internal hook error */}
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <SimpleSphere />
                </Float>
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default ThreeDHero;
