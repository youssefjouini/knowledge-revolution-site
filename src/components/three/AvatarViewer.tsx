import { Canvas } from '@react-three/fiber';
import { Bounds, Center, ContactShadows, OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';

/** DOM overlay (outside the canvas) showing download progress. */
function Loader() {
  const { active, progress } = useProgress();
  if (!active && progress >= 100) return null;
  return (
    <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-label text-sm text-mist" aria-live="polite">
      Loading avatar… {Math.round(progress)}%
    </p>
  );
}

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}

/**
 * Interactive viewer for the avatar .glb (drag to rotate, scroll/pinch to zoom).
 * Put the file in public/models/avatar.glb — compress it first (see README).
 */
export default function AvatarViewer({ src, label = '3D avatar' }: { src: string; label?: string }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);

  return (
    <div className="relative size-full" role="img" aria-label={`${label} — interactive 3D model. Drag to rotate, scroll or pinch to zoom.`}>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.4, 3.2], fov: 35 }} gl={{ antialias: true, alpha: true }} shadows>
        <ambientLight intensity={0.45} />
        {/* warm key light (knowledge / gold) */}
        <directionalLight position={[3, 4, 3]} intensity={2.2} color="#F3C877" castShadow />
        {/* cool rim light (AI / cyan) */}
        <directionalLight position={[-3, 2, -3]} intensity={1.6} color="#5CE1E6" />
        <pointLight position={[0, -1, 2]} intensity={0.6} color="#ffffff" />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.15}>
            <Center>
              <Model src={src} />
            </Center>
          </Bounds>
          <ContactShadows position={[0, -1, 0]} opacity={0.45} scale={6} blur={2.6} far={2} color="#000814" />
        </Suspense>
        <OrbitControls makeDefault enablePan={false} minDistance={1.2} maxDistance={6} autoRotate={!reduced} autoRotateSpeed={0.8} />
      </Canvas>
      <Loader />
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-label text-[0.65rem] tracking-[0.2em] text-mist uppercase">
        Drag to rotate · Scroll to zoom
      </p>
    </div>
  );
}
