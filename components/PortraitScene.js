'use client';

import { Component, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const MODEL_URL = '/api/model?v=2';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('[PortraitScene error]', error, info);
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

// Adjust BASE_Y to fix model orientation: -Math.PI/2 = face right→front
const BASE_Y = -Math.PI / 2;

function AvatarModel({ mouseRef, isMobile }) {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    if (isMobile) {
      ref.current.rotation.y = BASE_Y + Math.sin(t * 0.4) * 0.3;
      ref.current.position.y = Math.sin(t * 0.8) * 0.05;
    } else {
      const tx = BASE_Y + mouseRef.current.x * 0.45;
      const ty = mouseRef.current.y * 0.28;
      ref.current.rotation.y += (tx - ref.current.rotation.y) * 0.06;
      ref.current.rotation.x += (ty - ref.current.rotation.x) * 0.06;
    }
  });

  return <primitive ref={ref} object={scene} scale={3.4} />;
}

useGLTF.preload(MODEL_URL);


export default function PortraitScene() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = !window.matchMedia('(pointer: fine)').matches;

    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isMobile.current) window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [0, 0.3, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 4, 6]} intensity={2.0} />
        <directionalLight position={[4, 2, 2]} intensity={0.8} />
        <directionalLight position={[-4, 2, 2]} intensity={0.5} />
        <Suspense fallback={null}>
          <AvatarModel mouseRef={mouseRef} isMobile={isMobile.current} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
