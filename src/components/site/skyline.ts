/** Deterministic Old Sana'a skyline: tower houses with gypsum bands and small qamariya windows that light up at night. */
export function skylineSVG(): string {
  const W = 1200, H = 220;
  let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">`;
  let x = -20, seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const glass = ['--g-ruby', '--g-saffron', '--g-cobalt', '--g-emerald', '--g-white'];
  while (x < W) {
    const w = 56 + Math.floor(rnd() * 60), h = 90 + Math.floor(rnd() * 120), top = H - h;
    s += `<rect x="${x}" y="${top}" width="${w}" height="${h}" style="fill:var(--skyline)"/>`;
    for (let fy = top + 22; fy < H - 10; fy += 30) {
      s += `<rect x="${x + 4}" y="${fy}" width="${w - 8}" height="2" style="fill:var(--gypsum)" opacity="0.18"/>`;
      for (let wx = x + 10; wx < x + w - 14; wx += 18) {
        if (rnd() < 0.55) {
          const g = glass[Math.floor(rnd() * glass.length)];
          s += `<path d="M${wx} ${fy + 20} V${fy + 11} A4 4 0 0 1 ${wx + 8} ${fy + 11} V${fy + 20} Z" style="fill:var(${g});opacity:calc(0.15 + 0.75 * var(--glow))"/>`;
        }
      }
    }
    for (let cx = x + 2; cx < x + w - 6; cx += 8) s += `<path d="M${cx} ${top} l3 -5 l3 5 Z" style="fill:var(--skyline)"/>`;
    x += w + 2 + Math.floor(rnd() * 6);
  }
  return s + '</svg>';
}
