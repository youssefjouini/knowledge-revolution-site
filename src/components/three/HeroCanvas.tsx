import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { sampleBook, sampleBust, sampleMotes, scatter } from './bust';

const CYAN = new THREE.Color('#5CE1E6');
const GOLD = new THREE.Color('#E8A93A');

type Props = { lite: boolean; reduced: boolean; onReady: () => void };

/* ------------------------------------------------------------------ */
/*  Shared pointer (whole window, so the hero reacts everywhere)       */
/* ------------------------------------------------------------------ */
const pointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true },
  );
}

/* ------------------------------------------------------------------ */
/*  Particle material — morphs from a scattered cloud to the target    */
/* ------------------------------------------------------------------ */
const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uMix;
  attribute vec3 aStart;
  attribute float aRandom;
  attribute float aFade;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float delay = aRandom * 0.45;
    float p = clamp((uProgress - delay) / 0.55, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);

    vec3 pos = mix(aStart, position, p);
    pos += normalize(position + 0.0001) * sin(uTime * 1.6 + aRandom * 30.0) * 0.01 * p;

    // holographic scan line sweeping from bottom to top
    float scanY = mod(uTime * 0.55, 4.6) - 2.1;
    float band = 1.0 - smoothstep(0.0, 0.07, abs(position.y - scanY));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aRandom * 0.9) * (1.0 + band * 1.3) * uPixelRatio / -mv.z;

    vColor = mix(uColorA, uColorB, clamp(uMix * aRandom + band * 0.7, 0.0, 1.0));
    float twinkle = 0.75 + 0.25 * sin(uTime * 3.0 + aRandom * 50.0);
    vAlpha = aFade * (0.25 + 0.75 * p) * twinkle * (0.7 + band * 0.6);
  }
`;

const particleFragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

function useParticleMaterial(colorA: THREE.Color, colorB: THREE.Color, mix: number, size: number) {
  const dpr = useThree((s) => s.viewport.dpr);
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSize: { value: size },
          uPixelRatio: { value: dpr },
          uColorA: { value: colorA },
          uColorB: { value: colorB },
          uMix: { value: mix },
        },
      }),
    [colorA, colorB, mix, size, dpr],
  );
}

function makeGeometry(target: Float32Array, fade: Float32Array, spread = 7) {
  const count = fade.length;
  const g = new THREE.BufferGeometry();
  const rnd = new Float32Array(count);
  for (let i = 0; i < count; i++) rnd[i] = Math.random();
  g.setAttribute('position', new THREE.BufferAttribute(target, 3));
  g.setAttribute('aStart', new THREE.BufferAttribute(scatter(count, spread), 3));
  g.setAttribute('aRandom', new THREE.BufferAttribute(rnd, 1));
  g.setAttribute('aFade', new THREE.BufferAttribute(fade, 1));
  return g;
}

/* ------------------------------------------------------------------ */
/*  Bust + book + rising motes                                         */
/* ------------------------------------------------------------------ */
function Hologram({ lite, reduced }: { lite: boolean; reduced: boolean }) {
  const bust = useMemo(() => {
    const { pos, fade } = sampleBust(lite ? 4200 : 9000);
    return makeGeometry(pos, fade);
  }, [lite]);
  const book = useMemo(() => {
    const { pos, fade } = sampleBook(lite ? 900 : 2000);
    return makeGeometry(pos, fade, 5);
  }, [lite]);
  const motes = useMemo(() => {
    const { pos, fade } = sampleMotes(lite ? 90 : 220);
    return makeGeometry(pos, fade, 3);
  }, [lite]);

  const bustMat = useParticleMaterial(CYAN, GOLD, 0.45, lite ? 24 : 19);
  const bookMat = useParticleMaterial(GOLD, CYAN, 0.25, lite ? 24 : 20);
  const moteMat = useParticleMaterial(CYAN, GOLD, 1.0, 34);
  const motesRef = useRef<THREE.Points>(null);
  const start = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (start.current === null) start.current = t;
    const progress = reduced ? 1 : Math.min(1, (t - start.current) / 2.8);
    for (const m of [bustMat, bookMat, moteMat]) {
      m.uniforms.uTime.value = reduced ? 1.2 : t;
      m.uniforms.uProgress.value = progress;
    }
    // motes drift upward and loop
    if (motesRef.current && !reduced) {
      const arr = motes.attributes.position.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += 0.004 + (i % 7) * 0.0006;
        if (arr[i] > 3.4) arr[i] = 0;
      }
      motes.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <points geometry={bust} material={bustMat} />
      <points geometry={book} material={bookMat} position={[0, -1.95, 0.15]} rotation={[0.55, 0, 0]} scale={[0.85, 1.1, 0.85]} />
      <points ref={motesRef} geometry={motes} material={moteMat} position={[0, -1.95, 0]} />
      {/* soft light beam from the book */}
      <mesh position={[0, -0.9, -0.2]}>
        <planeGeometry args={[2.6, 2.6]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: CYAN } }}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
          fragmentShader={`uniform vec3 uColor; varying vec2 vUv;
            void main(){
              float w = 0.12 + vUv.y * 0.42;
              float x = abs(vUv.x - 0.5);
              float a = smoothstep(w, 0.0, x) * smoothstep(1.0, 0.1, vUv.y) * 0.12;
              gl_FragColor = vec4(uColor, a);
            }`}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Sound-wave rings — the avatar is speaking                          */
/* ------------------------------------------------------------------ */
function SoundWaves({ reduced }: { reduced: boolean }) {
  const SEG = 200;
  const rings = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SEG * 3), 3));
        const m = new THREE.LineBasicMaterial({
          color: i === 1 ? GOLD : CYAN,
          transparent: true,
          opacity: 0.55 - i * 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        return new THREE.LineLoop(g, m);
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = reduced ? 0.8 : clock.getElapsedTime();
    // speech-like envelope: syllables inside phrases
    const envelope = 0.35 + 0.65 * Math.abs(Math.sin(t * 2.3) * Math.sin(t * 0.7 + 1.2));
    rings.forEach((line, ri) => {
      const arr = line.geometry.attributes.position.array as Float32Array;
      const base = 0.62 + ri * 0.3;
      for (let s = 0; s < SEG; s++) {
        const a = (s / SEG) * Math.PI * 2;
        const wave =
          Math.sin(a * 12 + t * 5 - ri) * 0.05 * envelope +
          Math.sin(a * 5 - t * 3 + ri) * 0.03 * envelope +
          Math.sin(a * 23 + t * 9) * 0.012;
        const r = base + wave;
        arr[s * 3] = Math.cos(a) * r;
        arr[s * 3 + 1] = wave * 1.6;
        arr[s * 3 + 2] = Math.sin(a) * r;
      }
      line.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group position={[0, 0.02, 0]} rotation={[0.42, 0, 0]}>
      {rings.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbiting glass tiles with the icons of the slides                  */
/* ------------------------------------------------------------------ */
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const ICONS: { path: string; label?: string }[] = [
  { path: 'M22 10 12 5 2 10l10 5 10-5z M6 12v5c3 2 9 2 12 0v-5 M22 10v6' }, // cap
  { path: 'M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z' }, // book
  { path: 'M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4', label: 'AI' },
  { path: 'M12 5a3 3 0 0 0-5.8.9A3 3 0 0 0 4 11a3 3 0 0 0 1.5 5A3 3 0 0 0 12 18z M12 5a3 3 0 0 1 5.8.9A3 3 0 0 1 20 11a3 3 0 0 1-1.5 5A3 3 0 0 1 12 18z M12 5v13' }, // brain
  { path: `${circle(12, 12, 9)} M3 12h18 M12 3a14 14 0 0 1 0 18 M12 3a14 14 0 0 0 0 18` }, // globe
  { path: 'M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M7 8h10 M7 12h7' }, // chat
  { path: 'M4 5h8M8 3v2M6 5c0 4 3 7 6 8M10 5c0 3-2 6-6 8 M13 21l4-9 4 9M14.5 18h5' }, // languages
  { path: `M4 9h4l5-4v14l-5-4H4z M16 9a4 4 0 0 1 0 6 M19 6a8 8 0 0 1 0 12` }, // voice
];

function makeTileTexture(icon: (typeof ICONS)[number], gold: boolean) {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;
  const r = 44;
  ctx.beginPath();
  ctx.roundRect(10, 10, S - 20, S - 20, r);
  const grad = ctx.createLinearGradient(0, 0, S, S);
  grad.addColorStop(0, 'rgba(92,225,230,0.20)');
  grad.addColorStop(1, 'rgba(26,38,86,0.35)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = gold ? 'rgba(232,169,58,0.85)' : 'rgba(92,225,230,0.8)';
  ctx.stroke();

  ctx.save();
  const scale = 5.2;
  ctx.translate(S / 2 - 12 * scale, S / 2 - 12 * scale);
  ctx.scale(scale, scale);
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = gold ? '#F3C877' : '#BFF6F8';
  ctx.stroke(new Path2D(icon.path));
  if (icon.label) {
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = '700 5px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon.label, 12, 12.4);
  }
  ctx.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function OrbitTiles({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tiles = useMemo(
    () =>
      ICONS.map((icon, i) => {
        const a = (i / ICONS.length) * Math.PI * 2;
        const radius = i % 2 ? 1.7 : 1.95;
        return {
          tex: makeTileTexture(icon, i % 3 === 1),
          pos: [Math.cos(a) * radius, (i % 3) * 0.55 - 0.35, Math.sin(a) * radius] as [number, number, number],
          size: i % 2 ? 0.36 : 0.42,
          phase: a,
        };
      }),
    [],
  );
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }, delta) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y += delta * 0.12;
    refs.current.forEach((g, i) => {
      if (g) g.position.y = tiles[i].pos[1] + Math.sin(t * 0.8 + tiles[i].phase) * 0.08;
    });
  });

  return (
    <group rotation={[0.16, 0, -0.1]}>
      <group ref={group} rotation={[0, 0.4, 0]}>
        {tiles.map((t, i) => (
          <group key={i} position={t.pos} ref={(el) => { refs.current[i] = el; }}>
            <Billboard>
              <mesh>
                <planeGeometry args={[t.size, t.size]} />
                <meshBasicMaterial map={t.tex} transparent depthWrite={false} opacity={0.95} />
              </mesh>
            </Billboard>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Mouse parallax + ready signal                                      */
/* ------------------------------------------------------------------ */
function Rig({ children, reduced, onReady }: { children: React.ReactNode; reduced: boolean; onReady: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const frames = useRef(0);
  useFrame(({ clock }) => {
    if (frames.current < 3 && ++frames.current === 3) onReady();
    const g = ref.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const targetY = reduced ? 0 : pointer.x * 0.35 + Math.sin(t * 0.25) * 0.08;
    const targetX = reduced ? 0 : pointer.y * 0.12;
    g.rotation.y += (targetY - g.rotation.y) * 0.05;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
    if (!reduced) g.position.y = Math.sin(t * 0.9) * 0.04;
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroCanvas({ lite, reduced, onReady }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Pause rendering when the hero is scrolled out of view
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="size-full">
      <Canvas
        dpr={lite ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, -0.1, 7.8], fov: 38 }}
        gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
        frameloop={inView ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
      >
        <Rig reduced={reduced} onReady={onReady}>
          <Hologram lite={lite} reduced={reduced} />
          <SoundWaves reduced={reduced} />
          <OrbitTiles reduced={reduced} />
        </Rig>
      </Canvas>
    </div>
  );
}
