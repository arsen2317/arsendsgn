'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const MODEL_URL = 'https://github.com/arsen2317/arsendsgn/releases/download/3d/voxel.character.3d.model.glb';

function AvatarModel({ mouseRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    const tx = mouseRef.current.x * 0.45;
    const ty = -mouseRef.current.y * 0.28;
    ref.current.rotation.y += (tx - ref.current.rotation.y) * 0.06;
    ref.current.rotation.x += (ty - ref.current.rotation.x) * 0.06;
  });

  return <primitive ref={ref} object={scene} />;
}

useGLTF.preload(MODEL_URL);


export default function PortraitScene() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 3]} intensity={1.5} />
      <directionalLight position={[-2, 0, 2]} intensity={0.4} />
      <Suspense fallback={null}>
        <AvatarModel mouseRef={mouseRef} />
      </Suspense>
    </Canvas>
  );
}
