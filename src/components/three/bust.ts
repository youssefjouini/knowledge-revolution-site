/**
 * Procedural point clouds for the hero: a stylised bust (head, neck, shoulders)
 * and an open book. No 3D file needed — everything is computed on load.
 */

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function randomOnSphere() {
  const u = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t), u, s * Math.sin(t)] as const;
}

/** Scattered cloud used as the starting position of the "assembling" animation. */
export function scatter(count: number, radius = 7) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = randomOnSphere();
    const r = radius * Math.cbrt(Math.random()) + 1.5;
    out.set([x * r, y * r * 0.8, z * r], i * 3);
  }
  return out;
}

export function sampleBust(count: number) {
  const pos = new Float32Array(count * 3);
  const fade = new Float32Array(count);
  const HEAD = { cx: 0, cy: 0.98, rx: 0.5, ry: 0.68, rz: 0.58 };

  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x = 0, y = 0, z = 0, f = 1;

    if (r < 0.46) {
      // --- Head: ellipsoid with a narrower jaw, nose, brow and eye sockets
      const [sx, sy, sz] = randomOnSphere();
      const jaw = sy < 0 ? 1 - 0.28 * -sy : 1;
      x = sx * HEAD.rx * jaw;
      y = sy * HEAD.ry;
      z = sz * HEAD.rz * (sy < -0.2 ? 0.9 : 1);
      if (z > 0) {
        const nose = Math.exp(-(x * x) / 0.006 - ((y + 0.02) ** 2) / 0.05);
        const brow = Math.exp(-((y - 0.18) ** 2) / 0.004) * (1 - Math.min(1, Math.abs(x) / 0.4));
        const eyes = Math.exp(-((Math.abs(x) - 0.2) ** 2) / 0.006 - ((y - 0.1) ** 2) / 0.004);
        const lips = Math.exp(-(x * x) / 0.02 - ((y + 0.3) ** 2) / 0.002);
        z += 0.16 * nose + 0.04 * brow - 0.07 * eyes + 0.03 * lips;
      }
      x += HEAD.cx;
      y += HEAD.cy;
    } else if (r < 0.53) {
      // --- Neck
      const t = Math.random() * Math.PI * 2;
      y = rand(0.02, 0.45);
      x = Math.cos(t) * 0.23;
      z = Math.sin(t) * 0.22 + 0.02;
    } else {
      // --- Torso: elliptic cross-sections that widen into shoulders
      const yy = -Math.pow(Math.random(), 0.85) * 1.45; // 0 → -1.45
      const t = Math.random() * Math.PI * 2;
      const k = Math.min(1, -yy / 0.42);
      const shoulder = 0.26 + (1.08 - 0.26) * Math.sin((k * Math.PI) / 2); // neck → shoulders
      const w = yy < -0.42 ? 1.08 - (-yy - 0.42) * 0.22 : shoulder;
      const d = yy < -0.42 ? 0.5 - (-yy - 0.42) * 0.08 : 0.24 + 0.26 * k;
      // drop the shoulder line a bit at the sides (trapezius)
      x = Math.cos(t) * w;
      z = Math.sin(t) * d;
      y = yy - 0.18 * Math.pow(Math.abs(Math.cos(t)), 3) * k;
      // bottom of the bust fades into the light beam
      f = 1 - Math.max(0, (-y - 0.9) / 0.6);
    }

    // tiny jitter gives a volumetric, "hologram" feel
    pos.set([x + rand(-0.012, 0.012), y + rand(-0.012, 0.012), z + rand(-0.012, 0.012)], i * 3);
    fade[i] = Math.max(0.05, f);
  }
  return { pos, fade };
}

/** An open book lying under the bust (the "knowledge" symbol of the Big Idea). */
export function sampleBook(count: number) {
  const pos = new Float32Array(count * 3);
  const fade = new Float32Array(count);
  const W = 1.55, D = 0.75;
  for (let i = 0; i < count; i++) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const edge = Math.random() < 0.18; // page-stack edges & outline
    const t = edge ? (Math.random() < 0.5 ? 1 : Math.random()) : Math.random();
    const x = side * t * W;
    const z = edge && t !== 1 ? (Math.random() < 0.5 ? -D : D) : rand(-D, D);
    const y = 0.26 * Math.sin(Math.PI * Math.min(1, t * 1.05)) * (1 - 0.35 * t) + (t < 0.04 ? -0.05 : 0);
    // a few "text lines" on the pages
    const lines = !edge && Math.random() < 0.35;
    const zz = lines ? Math.round(z * 9) / 9 : z;
    pos.set([x, y + rand(-0.008, 0.008), zz], i * 3);
    fade[i] = edge ? 1 : lines ? 0.8 : 0.45;
  }
  return { pos, fade };
}

/** Motes rising from the book into the bust. */
export function sampleMotes(count: number) {
  const pos = new Float32Array(count * 3);
  const fade = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 1.1;
    pos.set([Math.cos(a) * r, Math.random() * 3.4, Math.sin(a) * r * 0.6], i * 3);
    fade[i] = rand(0.3, 1);
  }
  return { pos, fade };
}
