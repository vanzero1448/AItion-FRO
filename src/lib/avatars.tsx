import React from "react";

export function hashStr(str: string): number {
  if (!str) str = "Aition";
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  let s = seed === 0 ? 1 : seed;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generatePixelAvatar(str: string, size: number = 40) {
  const hash = hashStr(str);
  const rng = makeRng(hash);
  const baseHue = hash % 360;
  const bgColor = hslToHex(baseHue, 30, 95);
  const primaryColor = hslToHex(baseHue, 70, 50);
  const accentColor = hslToHex((baseHue + 60) % 360, 80, 60);

  const GRID = 8;
  const rects = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID / 2; col++) {
      if (rng() > 0.45) {
        const fill = rng() > 0.85 ? accentColor : primaryColor;
        const x1 = col * (size / GRID);
        const x2 = (GRID - 1 - col) * (size / GRID);
        const y = row * (size / GRID);
        rects.push(
          <rect
            key={`${row}-${col}-1`}
            x={x1}
            y={y}
            width={size / GRID}
            height={size / GRID}
            fill={fill}
          />,
        );
        rects.push(
          <rect
            key={`${row}-${col}-2`}
            x={x2}
            y={y}
            width={size / GRID}
            height={size / GRID}
            fill={fill}
          />,
        );
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ background: bgColor, display: "block" }}
    >
      {rects}
    </svg>
  );
}
