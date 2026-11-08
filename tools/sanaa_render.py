"""Procedural renderer for Old Sana'a doors, gypsum frames and qamariya windows.

Everything is built from height maps lit by a single light, so carving, glass and metal read as real
materials. Outputs WebP files with alpha, sized for 2x displays.
"""
import math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
os.makedirs(OUT, exist_ok=True)
LIGHT = np.array([-0.55, -0.75, 1.0]); LIGHT = LIGHT / np.linalg.norm(LIGHT)


# ---------------------------------------------------------------- helpers
def rng(seed):
    return np.random.default_rng(seed)


def value_noise(h, w, cell, seed, octaves=4):
    """Smooth fractal noise in [0,1]."""
    r = rng(seed); out = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        c = max(2, int(cell / (2 ** o)))
        gh, gw = h // c + 3, w // c + 3
        g = r.random((gh, gw))
        up = ndi.zoom(g, (c, c), order=3)[:h, :w]
        out += up * amp; tot += amp; amp *= 0.5
    out /= tot
    return (out - out.min()) / (out.max() - out.min() + 1e-9)


def aniso_noise(h, w, cx, cy, seed, octaves=3):
    """Noise stretched along y (cy >> cx) for grain and glass streaks."""
    r = rng(seed); out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        sx, sy = max(2, int(cx / 2 ** o)), max(2, int(cy / 2 ** o))
        g = r.random((h // sy + 3, w // sx + 3))
        up = ndi.zoom(g, (sy, sx), order=3)[:h, :w]
        out += up * amp; tot += amp; amp *= 0.5
    out /= tot
    return (out - out.min()) / (out.max() - out.min() + 1e-9)


def mask_from(draw_fn, w, h):
    im = Image.new('L', (w, h), 0); d = ImageDraw.Draw(im); draw_fn(d)
    return np.asarray(im) > 127


def shade(height, scale=1.0, light=LIGHT):
    gy, gx = np.gradient(height * scale)
    n = np.dstack([-gx, -gy, np.ones_like(height)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    lam = np.clip((n * light).sum(axis=2), 0, 1)
    half = light + np.array([0, 0, 1.0]); half /= np.linalg.norm(half)
    spec = np.clip((n * half).sum(axis=2), 0, 1)
    return lam, spec


def ao(height, sigma, k):
    return np.clip(1 - k * np.clip(ndi.gaussian_filter(height, sigma) - height, 0, None), 0.35, 1)


def to_img(rgb, alpha=None, size=None):
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    if alpha is None:
        im = Image.fromarray(rgb, 'RGB')
    else:
        a = np.clip(alpha * 255, 0, 255).astype(np.uint8)
        im = Image.fromarray(np.dstack([rgb, a]), 'RGBA')
    if size: im = im.resize(size, Image.LANCZOS)
    return im


def save(im, name, q=86):
    p = os.path.join(OUT, name); im.save(p, 'WEBP', quality=q, method=6); return p


def poly_dist_height(mask, bevel):
    """Raised panel: plateau with bevel; large bevel -> pyramid/ridge (diamond point)."""
    d = ndi.distance_transform_edt(mask)
    return np.clip(d / bevel, 0, 1)


# ---------------------------------------------------------------- glass palette
GLASS = {
    'red': (204, 30, 38), 'green': (34, 150, 64), 'yellow': (244, 196, 36), 'blue': (34, 84, 206),
    'purple': (118, 56, 176), 'orange': (238, 118, 28), 'clear': (236, 232, 214), 'teal': (28, 166, 178),
}


def qamariya(R, pattern, weights, seed, ss=2, name=None):
    """Render a semicircular qamariya of radius R (final px). Returns RGBA Image (2R x R)."""
    S = R * ss; W, H = 2 * S, S
    cx, cy = S, S  # bottom centre
    r = rng(seed)
    yy, xx = np.mgrid[0:H, 0:W]
    dx, dy = xx - cx, cy - yy
    rr = np.hypot(dx, dy); ang = np.degrees(np.arctan2(dy, dx))  # 0..180
    inside = (rr <= S) & (dy >= 0)

    lw = max(2, int(S * 0.022))
    tr = Image.new('L', (W, H), 0); d = ImageDraw.Draw(tr)

    def circ(x, y, rad, width=lw):
        d.ellipse([cx + x - rad, cy - y - rad, cx + x + rad, cy - y + rad], outline=255, width=width)

    def line(a, b, width=lw):
        d.line([(cx + a[0], cy - a[1]), (cx + b[0], cy - b[1])], fill=255, width=width)

    def polar(rad, deg):
        return (rad * math.cos(math.radians(deg)), rad * math.sin(math.radians(deg)))

    # rim
    circ(0, 0, S - lw * 1.2, int(lw * 2.6))
    d.rectangle([0, H - int(lw * 1.6), W, H], fill=255)

    if pattern == 'star':
        circ(0, 0, S * 0.84, lw); circ(0, 0, S * 0.965, int(lw * 0.8))
        for k in range(0, 25):
            a = 180 * k / 24; line(polar(S * 0.84, a), polar(S * 0.97, a), int(lw * 0.8))
        sc = (0, S * 0.40)
        for k in range(11):
            a = 180 * (k + 0.5) / 11; p = polar(S * 0.64, a); circ(p[0], p[1], S * 0.19)
        for k in range(8):
            a = 360 * k / 8 + 22.5; p = (sc[0] + S * 0.2 * math.cos(math.radians(a)), sc[1] + S * 0.2 * math.sin(math.radians(a))); circ(p[0], p[1], S * 0.1)
        for rot in (0, 45):
            pts = [(cx + sc[0] + S * 0.15 * math.cos(math.radians(rot + 90 * i + 45)), cy - sc[1] - S * 0.15 * math.sin(math.radians(rot + 90 * i + 45))) for i in range(4)]
            d.polygon(pts, outline=255, width=lw)
        circ(sc[0], sc[1], S * 0.06); circ(sc[0], sc[1], S * 0.3)
        circ(0, 0, S * 0.13)
        for k in range(5):
            a = 180 * (k + 0.5) / 5; p = polar(S * 0.3, a); circ(p[0], p[1], S * 0.07)
    elif pattern == 'fan':
        n = 16
        for k in range(n + 1):
            a = 180 * k / n; line(polar(S * 0.16, a), polar(S * 0.8, a))
        circ(0, 0, S * 0.16); circ(0, 0, S * 0.36); circ(0, 0, S * 0.62); circ(0, 0, S * 0.8)
        for k in range(n):
            a = 180 * (k + 0.5) / n
            p = polar(S * 0.49, a); circ(p[0], p[1], S * 0.065)
            p = polar(S * 0.71, a); circ(p[0], p[1], S * 0.045)
            p = polar(S * 0.8, a); circ(p[0], p[1], S * 0.09)
        for k in range(0, 2 * n + 1):
            a = 180 * k / (2 * n); line(polar(S * 0.88, a), polar(S * 0.97, a), int(lw * 0.8))
        circ(0, 0, S * 0.88, int(lw * 0.9))
    elif pattern == 'lattice':
        step = S * 0.19
        for k in range(-14, 15):
            off = k * step
            for th in (0, 60, 120):
                t = math.radians(th); nx, ny = -math.sin(t), math.cos(t)
                p0 = (off * nx - 3 * S * math.cos(t), off * ny - 3 * S * math.sin(t) + S * 0.02)
                p1 = (off * nx + 3 * S * math.cos(t), off * ny + 3 * S * math.sin(t) + S * 0.02)
                line(p0, p1, int(lw * 0.9))
        for i in range(-8, 9):
            for j in range(0, 9):
                x = i * step + (j % 2) * step / 2; y = j * step * math.sqrt(3) / 2 + S * 0.02
                if math.hypot(x, y) < S * 0.78: circ(x, y, S * 0.035, int(lw * 0.8))
        circ(0, 0, S * 0.8, int(lw * 1.4)); circ(0, 0, S * 0.18, int(lw * 1.2))
        for k in range(0, 31):
            a = 180 * k / 30; p = polar(S * 0.885, a); circ(p[0], p[1], S * 0.04, int(lw * 0.8))
    elif pattern == 'floral':
        for k in range(-4, 5):
            circ(k * S * 0.24, 0, S * 0.48, int(lw * 0.95))
        fc = (0, S * 0.5)
        for k in range(8):
            a = 360 * k / 8; p = (fc[0] + S * 0.11 * math.cos(math.radians(a)), fc[1] + S * 0.11 * math.sin(math.radians(a))); circ(p[0], p[1], S * 0.11, int(lw * 0.85))
        circ(fc[0], fc[1], S * 0.22); circ(fc[0], fc[1], S * 0.045)
        circ(0, 0, S * 0.12)
        circ(0, 0, S * 0.8, int(lw * 1.2)); circ(0, 0, S * 0.95, int(lw * 0.9))
        for k in range(0, 27):
            a = 180 * (k + 0.5) / 27; p = polar(S * 0.875, a); circ(p[0], p[1], S * 0.03, int(lw * 0.8))
    T = (np.asarray(tr) > 127) | ~inside | (rr > S - lw * 2.5)
    T = ndi.binary_closing(T, iterations=1)

    # panes
    lab, n = ndi.label(~T)
    sizes = ndi.sum(np.ones_like(lab), lab, index=np.arange(1, n + 1))
    cents = ndi.center_of_mass(np.ones_like(lab), lab, index=np.arange(1, n + 1))
    names = list(weights.keys()); w = np.array([weights[k] for k in names], float); w /= w.sum()
    col = np.zeros((n + 1, 3)); small = np.zeros(n + 1, bool)
    for i in range(1, n + 1):
        if sizes[i - 1] < (S * 0.012) ** 2: small[i] = True
        py, px = cents[i - 1]; pr = math.hypot(px - cx, cy - py) / S; pa = math.degrees(math.atan2(cy - py, px - cx))
        if pattern == 'star' and pr > 0.85:
            c = ['yellow', 'blue', 'orange', 'blue', 'yellow', 'purple'][int(pa / 7.5) % 6]
        elif pattern == 'fan' and pr > 0.88:
            c = ['yellow', 'orange'][int(pa / 5.6) % 2]
        elif pattern == 'lattice' and pr > 0.82:
            c = 'clear' if int(pa / 6) % 2 else 'yellow'
        elif pattern == 'floral' and pr > 0.83:
            c = ['red', 'yellow', 'green'][int(pa / 6.6) % 3]
        else:
            c = names[r.choice(len(names), p=w)]
        base = np.array(GLASS[c], float) * (0.9 + 0.2 * r.random())
        col[i] = base
    T = T | small[lab]
    dist = ndi.distance_transform_edt(~T)
    glow = 0.62 + 0.5 * (1 - np.exp(-dist / (S * 0.035)))
    streak = aniso_noise(H, W, int(S * 0.02) + 2, int(S * 0.2) + 2, seed + 5)
    fine = value_noise(H, W, int(S * 0.04) + 2, seed + 6, 3)
    rgb = col[lab] * (glow * (0.9 + 0.16 * streak) * (0.95 + 0.1 * fine))[..., None]
    # light hotspot like a lamp behind the glass
    hot = np.exp(-((dx / (S * 0.9)) ** 2 + ((dy - S * 0.35) / (S * 0.7)) ** 2))
    rgb = rgb * (0.85 + 0.35 * hot[..., None])

    # gypsum tracery with relief
    th = ndi.distance_transform_edt(T & inside)
    hgt = np.sqrt(np.clip(th / (lw * 0.9), 0, 1))
    lam, spec = shade(hgt, scale=lw * 0.9)
    gnoise = value_noise(H, W, int(S * 0.05) + 2, seed + 9, 3)
    gyp = np.array([236, 230, 216], float)
    trc = gyp[None, None, :] * (0.55 + 0.55 * lam[..., None]) * (0.94 + 0.08 * gnoise[..., None])
    edge = (T & inside) & (th < 1.6)
    trc[edge] *= 0.55
    out = np.where((T & inside)[..., None], trc, rgb)
    alpha = inside.astype(float)
    alpha = ndi.gaussian_filter(alpha, 0.6)
    im = to_img(out, alpha, size=(2 * R, R))
    if name: save(im, name)
    return im


# ---------------------------------------------------------------- door leaf
WOODS = {
    'red': (128, 72, 42), 'walnut': (84, 52, 34), 'honey': (156, 102, 54), 'grey': (112, 94, 78),
}
METALS = {'bronze': (150, 112, 60), 'iron': (78, 76, 74), 'brass': (176, 138, 66)}


def wood_texture(H, W, base, seed, horizontal_mask=None):
    n1 = aniso_noise(H, W, 6, 90, seed)
    xx = np.arange(W)[None, :].repeat(H, 0)
    g = 0.5 + 0.5 * np.sin(2 * math.pi * (xx / 9.0 + 3.2 * n1))
    if horizontal_mask is not None:
        n2 = aniso_noise(W, H, 6, 90, seed + 1).T
        yy = np.arange(H)[:, None].repeat(W, 1)
        gh = 0.5 + 0.5 * np.sin(2 * math.pi * (yy / 9.0 + 3.2 * n2))
        g = np.where(horizontal_mask, gh, g)
    fine = value_noise(H, W, 10, seed + 2, 3)
    blotch = value_noise(H, W, 120, seed + 3, 3)
    tone = (0.78 + 0.16 * g + 0.08 * fine) * (0.85 + 0.25 * blotch)
    return np.array(base, float)[None, None, :] * tone[..., None]


def carved_band(H, W, mask, motif, unit, seed, lw):
    """Grooves carved into a raised band: rosettes + scrolls, beads, zigzag or chain."""
    im = Image.new('L', (W, H), 0); d = ImageDraw.Draw(im)
    ys, xs = np.nonzero(mask)
    if motif == 'scroll':
        for y in range(0, H, unit):
            for x in range(0, W, unit):
                d.ellipse([x + unit * .18, y + unit * .18, x + unit * .82, y + unit * .82], outline=255, width=lw)
                d.ellipse([x + unit * .38, y + unit * .38, x + unit * .62, y + unit * .62], outline=255, width=lw)
                d.arc([x - unit * .3, y + unit * .2, x + unit * .5, y + unit * 1.0], 270, 90, fill=255, width=lw)
    elif motif == 'beads':
        for y in range(0, H, unit // 2):
            for x in range(0, W, unit // 2):
                d.ellipse([x + 2, y + 2, x + unit // 2 - 2, y + unit // 2 - 2], outline=255, width=lw)
    elif motif == 'zigzag':
        for y in range(0, H, unit // 2):
            pts = []
            for x in range(-unit, W + unit, unit // 2):
                pts.append((x, y + (unit // 4 if (x // (unit // 2)) % 2 else 0)))
            d.line(pts, fill=255, width=lw)
    elif motif == 'chain':
        for y in range(0, H, unit // 2):
            for x in range(0, W, unit // 2):
                d.ellipse([x - unit * .1, y - unit * .1, x + unit * .6, y + unit * .6], outline=255, width=lw)
    g = (np.asarray(im) > 127) & mask
    return ndi.gaussian_filter(g.astype(float), lw * 0.45)


def door_leaf(cfg, W=300, H=485, ss=2, name=None):
    S = ss; w, h = W * S, H * S
    u = w / 120.0  # viewBox unit
    seed = cfg['seed']
    hgt = np.zeros((h, w)); metal = np.zeros((h, w), bool); metal_h = np.zeros((h, w))
    # outer frame stile and carved border
    border = int(10 * u)
    outer = np.ones((h, w), bool)
    field = np.zeros((h, w), bool); field[border:h - border, border:w - border] = True
    band = outer & ~field
    hgt += 0.55 * band + 0.25 * field
    hgt -= 0.18 * carved_band(h, w, band, cfg['border'], int(14 * u), seed, max(2, int(1.1 * u)))
    # rosettes at corners and along the stiles
    rosettes = []
    for yy in np.linspace(border / 2, h - border / 2, cfg.get('rosettes', 7)):
        rosettes += [(border / 2, yy), (w - border / 2, yy)]
    yy, xx = np.mgrid[0:h, 0:w]
    for (rx, ry) in rosettes:
        rr = np.hypot(xx - rx, yy - ry); R = border * 0.42
        m = rr < R
        hgt[m] = 0.5 + 0.18 * np.cos(rr[m] / R * math.pi * 3)
    # moulding groove inside border
    grv = ndi.distance_transform_edt(field)
    hgt -= 0.12 * ((grv > 0) & (grv < 2.2 * u))

    def poly(points):
        pts = [(x * u, y * u) for x, y in points]
        return mask_from(lambda d: d.polygon(pts, fill=255), w, h)

    for p in cfg['panels']:
        kind = p[0]
        if kind == 'rect':
            _, x, y, pw, ph, bev = p
            m = poly([(x, y), (x + pw, y), (x + pw, y + ph), (x, y + ph)])
        elif kind == 'poly':
            _, pts, bev = p
            m = poly(pts)
        elif kind == 'arch':
            _, x, y, pw, ph, bev = p
            m = mask_from(lambda d: (d.rectangle([x * u, (y + pw / 2) * u, (x + pw) * u, (y + ph) * u], fill=255), d.pieslice([x * u, y * u, (x + pw) * u, (y + pw) * u], 180, 360, fill=255)), w, h)
        ring = ndi.binary_dilation(m, iterations=int(1.6 * u)) & ~m
        hgt[ring] -= 0.1
        ph_ = poly_dist_height(m, bev * u)
        hgt = np.where(m, 0.25 + 0.32 * ph_, hgt)
    # carved star medallion
    if cfg.get('star'):
        sx, sy, sr = cfg['star']
        pts = []
        for i in range(16):
            rad = sr if i % 2 == 0 else sr * 0.62
            a = math.radians(i * 22.5 - 90); pts.append((sx + rad * math.cos(a), sy + rad * math.sin(a)))
        m = poly(pts); hgt = np.where(m, 0.3 + 0.35 * poly_dist_height(m, sr * 0.5 * u), hgt)
    # wicket door outline
    if cfg.get('wicket'):
        x, y, pw, ph = cfg['wicket']
        m = mask_from(lambda d: (d.rectangle([x * u, (y + pw / 2) * u, (x + pw) * u, (y + ph) * u], outline=255, width=int(2.4 * u)), d.arc([x * u, y * u, (x + pw) * u, (y + pw) * u], 180, 360, fill=255, width=int(2.4 * u))), w, h)
        hgt[m] -= 0.22
    # horizontal iron straps
    for sy in cfg.get('straps', []):
        m = np.zeros((h, w), bool); m[int((sy - 2.6) * u):int((sy + 2.6) * u), int(3 * u):int(117 * u)] = True
        metal |= m; metal_h = np.where(m, 0.45 + 0.08 * np.sin((yy - sy * u) / (2.6 * u) * math.pi / 2 + math.pi / 2), metal_h)
    # studs
    studs = list(cfg.get('studs', []))
    for row in cfg.get('stud_rows', []):
        y0, x0, x1, step = row
        x = x0
        while x <= x1 + 0.01:
            studs.append((x, y0, 1.7)); x += step
    for (sx, sy, sr) in studs:
        rr = np.hypot(xx - sx * u, yy - sy * u); R = sr * u
        m = rr < R
        metal |= m; metal_h[m] = 0.55 + 0.35 * np.sqrt(1 - (rr[m] / R) ** 2)
    # ring knocker
    if cfg.get('ring'):
        kx, ky, kr = cfg['ring']
        rr = np.hypot(xx - kx * u, yy - ky * u); t = 1.25 * u
        m = np.abs(rr - kr * u) < t
        metal |= m; metal_h[m] = 0.6 + 0.3 * np.sqrt(np.clip(1 - ((rr[m] - kr * u) / t) ** 2, 0, 1))
        pm = (np.abs(xx - kx * u) < 2.2 * u) & (np.abs(yy - (ky - kr) * u) < 2 * u)
        metal |= pm; metal_h[pm] = 0.7
    # central Sana'ani lock plate with hanging bolt
    if cfg.get('lock'):
        lx, ly, ls = cfg['lock']
        pts = []
        for i in range(64):
            a = 2 * math.pi * i / 64
            rad = ls * (1 + 0.22 * math.cos(4 * a) + 0.1 * math.cos(8 * a))
            pts.append((lx + rad * math.sin(a), ly - rad * math.cos(a) * 0.95))
        m = poly(pts)
        metal |= m; metal_h = np.where(m, 0.5 + 0.3 * poly_dist_height(m, ls * 0.45 * u), metal_h)
        bolt = poly([(lx - ls * .22, ly - ls * .1), (lx + ls * .22, ly - ls * .1), (lx + ls * .3, ly + ls * 1.25), (lx, ly + ls * 1.55), (lx - ls * .3, ly + ls * 1.25)])
        metal |= bolt; metal_h = np.where(bolt, 0.8 + 0.25 * poly_dist_height(bolt, ls * 0.2 * u), metal_h)
    # vertical meeting line for double leaves
    if cfg.get('double'):
        m = (np.abs(xx - w / 2) < 0.9 * u) & field
        hgt[m] -= 0.25

    total_h = np.where(metal, metal_h, hgt)
    lam, spec = shade(total_h, scale=3.2 * u)
    occ = ao(total_h, 4 * u, 1.6)
    hmask = np.zeros((h, w), bool)
    for sy in cfg.get('rails', []):
        hmask[int(sy[0] * u):int(sy[1] * u), :] = True
    wood = wood_texture(h, w, WOODS[cfg['wood']], seed, hmask)
    rgb = wood * (0.28 + 0.95 * lam[..., None]) * occ[..., None]
    mc = np.array(METALS[cfg.get('metal', 'bronze')], float)
    mnoise = value_noise(h, w, int(6 * u), seed + 20, 3)
    mrgb = mc[None, None, :] * (0.3 + 0.8 * lam[..., None]) * (0.85 + 0.25 * mnoise[..., None]) + 255 * (spec ** 40)[..., None] * 0.55
    rgb = np.where(metal[..., None], mrgb, rgb)
    # weathering: darker towards edges and bottom
    vign = 1 - 0.18 * (np.abs(xx / w - 0.5) * 2) ** 3 - 0.14 * (yy / h) ** 4
    rgb *= vign[..., None]
    im = to_img(rgb, size=(W, H))
    if name: save(im, name)
    return im


# ---------------------------------------------------------------- gypsum frame around the door
def frame(cfg, W=460, H=828, ss=2, name=None):
    S = ss; w, h = W * S, H * S; u = w / 200.0
    yy, xx = np.mgrid[0:h, 0:w]
    X, Y = xx / u, yy / u
    outer = ((X >= 24) & (X <= 176) & (Y >= 150) & (Y <= 352)) | ((np.hypot(X - 100, Y - 150) <= 76) & (Y < 150))
    doorway = (X >= 40) & (X <= 160) & (Y >= 156) & (Y <= 350)
    window = (np.hypot(X - 100, Y - 148) <= 58) & (Y <= 146.5)
    crown = np.zeros((h, w), bool); spandrel = np.zeros((h, w), bool)
    c = cfg['crown']
    if c.startswith('alfiz'):
        spandrel = (X >= 24) & (X <= 176) & (Y >= 74) & (Y <= 150) & ~outer
        crown |= (X >= 22) & (X <= 178) & (Y >= 70) & (Y <= 76)
    if c == 'alfiz-merlons':
        for x0 in np.arange(26, 172, 12):
            crown |= (X >= x0) & (X <= x0 + 8) & (Y >= 60 - 4 * ((x0 // 12) % 2)) & (Y <= 72)
    elif c == 'alfiz-arches':
        for x0 in np.arange(24, 170, 14):
            crown |= (np.hypot(X - (x0 + 7), Y - 71) <= 6.5) & (Y <= 71)
    elif c == 'crest':
        R0 = 75
        for a in np.arange(12, 170, 12):
            t = np.radians(a); bx, by = 100 + R0 * np.cos(t), 150 - R0 * np.sin(t)
            vx, vy = np.cos(t), -np.sin(t)
            px, py = X - bx, Y - by
            along = px * vx + py * vy; across = np.abs(-px * vy + py * vx)
            crown |= (along >= -1) & (along <= 9) & (across <= 4.2 * (1 - np.clip(along, 0, 9) / 9))
    band = (outer & ~doorway & ~window) | crown | spandrel
    step = (X >= 30) & (X <= 170) & (Y >= 350) & (Y <= 360)
    # gypsum height: rounded band edges + carved motif
    d_in = ndi.distance_transform_edt(band)
    hgt = np.sqrt(np.clip(d_in / (3.0 * u), 0, 1)) * 0.6
    carve = carved_band(h, w, band & ~spandrel & (d_in > 2.5 * u), cfg['motif'], int(cfg.get('unit', 9) * u), cfg['seed'], max(2, int(0.9 * u)))
    hgt -= 0.2 * carve
    if spandrel.any():
        d_sp = ndi.distance_transform_edt(spandrel)
        hgt = np.where(spandrel, 0.32 * np.sqrt(np.clip(d_sp / (2.5 * u), 0, 1)) - 0.16 * carved_band(h, w, spandrel & (d_sp > 2 * u), 'beads', int(7 * u), cfg['seed'] + 3, max(2, int(0.8 * u))), hgt)
    # inner fillet line along the opening
    fil = band & (ndi.distance_transform_edt(~(doorway | window)) < 3.2 * u) & (ndi.distance_transform_edt(~(doorway | window)) > 1.8 * u)
    hgt[fil] -= 0.12
    lam, spec = shade(hgt, scale=4 * u)
    gnoise = value_noise(h, w, int(14 * u), cfg['seed'] + 1, 4)
    gyp = np.array(cfg.get('gypsum', (238, 232, 218)), float)
    rgb = gyp[None, None, :] * (0.5 + 0.6 * lam[..., None]) * (0.92 + 0.1 * gnoise[..., None])
    stone = np.array((150, 136, 120), float)[None, None, :] * (0.7 + 0.3 * gnoise[..., None])
    rgb = np.where(step[..., None], stone, rgb)
    alpha = (band | step).astype(float)
    # soft cast shadow on the wall
    sh = ndi.gaussian_filter(ndi.shift((band | step).astype(float), (5 * S, 3 * S), order=0), 6 * S)
    # shadow of the frame falling into the doorway (on top of the leaf)
    dw = doorway.astype(float)
    top_sh = np.clip(1 - (Y - 156) / 16, 0, 1) * dw
    side_sh = np.clip(1 - (X - 40) / 9, 0, 1) * dw
    in_sh = np.clip(np.maximum(top_sh, side_sh * 0.8), 0, 1) ** 1.6 * 0.6
    a_sh = np.clip(np.maximum(sh * 0.45 * (1 - alpha), in_sh), 0, 1)
    out_a = alpha + a_sh * (1 - alpha)
    out_rgb = np.where(alpha[..., None] > 0, rgb, 0)
    im = to_img(out_rgb, out_a, size=(W, H))
    if name: save(im, name)
    return im


def hero_arch(W=800, H=1000, ss=2, name=None, seed=77):
    S = ss; w, h = W * S, H * S; u = w / 400.0
    yy, xx = np.mgrid[0:h, 0:w]
    X, Y = xx / u, yy / u
    outer = ((X >= 34) & (X <= 366) & (Y >= 210)) | ((np.hypot(X - 200, Y - 210) <= 166) & (Y < 210))
    inner = ((X >= 50) & (X <= 350) & (Y >= 216)) | ((np.hypot(X - 200, Y - 206) <= 146) & (Y < 204))
    crown = np.zeros((h, w), bool)
    for a in np.arange(9, 175, 9):
        t = np.radians(a); bx, by = 200 + 165 * np.cos(t), 210 - 165 * np.sin(t)
        vx, vy = np.cos(t), -np.sin(t); px, py = X - bx, Y - by
        along = px * vx + py * vy; across = np.abs(-px * vy + py * vx)
        crown |= (along >= -1) & (along <= 14) & (across <= 6.5 * (1 - np.clip(along, 0, 14) / 14))
    band = (outer & ~inner) | crown
    d_in = ndi.distance_transform_edt(band)
    hgt = np.sqrt(np.clip(d_in / (4 * u), 0, 1)) * 0.6
    hgt -= 0.2 * carved_band(h, w, band & (d_in > 3 * u), 'scroll', int(11 * u), seed, max(2, int(1.0 * u)))
    lam, spec = shade(hgt, scale=4 * u)
    gnoise = value_noise(h, w, int(16 * u), seed + 1, 4)
    rgb = np.array((238, 232, 218), float)[None, None, :] * (0.5 + 0.6 * lam[..., None]) * (0.92 + 0.1 * gnoise[..., None])
    alpha = band.astype(float)
    sh = ndi.gaussian_filter(ndi.shift(alpha, (6 * S, 4 * S), order=0), 8 * S) * 0.35 * (1 - alpha)
    im = to_img(np.where(alpha[..., None] > 0, rgb, 0), alpha + sh, size=(W, H))
    if name: save(im, name)
    return im


DOORS = {
    'ai': dict(seed=11, wood='red', metal='bronze', border='scroll', rosettes=8,
               panels=[('poly', [(16, 14), (40, 14), (36, 34), (20, 34)], 9), ('poly', [(46, 14), (74, 14), (66, 34), (54, 34)], 9), ('poly', [(80, 14), (104, 14), (100, 34), (84, 34)], 9),
                       ('rect', 16, 40, 24, 30, 12), ('rect', 80, 40, 24, 30, 12), ('rect', 46, 74, 28, 24, 3), ('rect', 16, 76, 24, 24, 12), ('rect', 80, 76, 24, 24, 12),
                       ('rect', 16, 112, 40, 22, 3), ('rect', 64, 112, 40, 22, 3), ('poly', [(16, 148), (40, 148), (36, 172), (20, 172)], 9), ('rect', 46, 148, 28, 24, 12), ('poly', [(80, 148), (104, 148), (100, 172), (84, 172)], 9)],
               lock=(60, 54, 11), ring=(68, 98, 5),
               stud_rows=[(106, 16, 104, 8.8), (142, 16, 104, 8.8)], studs=[(43, 40, 1.6), (77, 40, 1.6), (43, 70, 1.6), (77, 70, 1.6)],
               rails=[(104, 109), (139, 145)]),
    'mobile': dict(seed=23, wood='walnut', metal='iron', border='chain', rosettes=6, double=True,
                   panels=[('rect', 15, 14, 40, 40, 20), ('rect', 65, 14, 40, 40, 20), ('rect', 15, 64, 40, 26, 13), ('rect', 65, 64, 40, 26, 13),
                           ('rect', 15, 100, 40, 40, 20), ('rect', 65, 100, 40, 40, 20), ('rect', 15, 150, 40, 30, 15), ('rect', 65, 150, 40, 30, 15)],
                   ring=(60, 92, 6), stud_rows=[(59, 15, 105, 7.5), (95, 15, 105, 7.5), (145, 15, 105, 7.5)], rails=[(56, 62), (92, 98), (142, 148)]),
    'web': dict(seed=37, wood='honey', metal='brass', border='beads', rosettes=7,
                panels=[('arch', 16, 14, 40, 40, 4), ('arch', 64, 14, 40, 40, 4), ('rect', 16, 62, 88, 14, 3),
                        ('rect', 16, 84, 24, 22, 12), ('rect', 80, 84, 24, 22, 12)],
                wicket=(38, 96, 44, 82), ring=(60, 118, 4.5), lock=(60, 72, 6),
                stud_rows=[(80, 16, 104, 6), (180, 16, 104, 8)], studs=[(44, 130, 1.5), (76, 130, 1.5), (44, 160, 1.5), (76, 160, 1.5)], rails=[(78, 82)]),
    'leadership': dict(seed=51, wood='grey', metal='iron', border='zigzag', rosettes=5,
                       panels=[('arch', 18, 14, 84, 52, 6), ('rect', 18, 120, 38, 56, 19), ('rect', 64, 120, 38, 56, 19)],
                       star=(60, 44, 15), straps=[78, 110], ring=(60, 94, 7),
                       stud_rows=[(78, 8, 112, 9), (110, 8, 112, 9)], studs=[(30, 150, 1.6), (90, 150, 1.6)], rails=[(74, 82), (106, 114)]),
}
FRAMES = {
    'ai': dict(seed=101, crown='alfiz-merlons', motif='scroll', unit=9),
    'mobile': dict(seed=102, crown='crest', motif='zigzag', unit=10),
    'web': dict(seed=103, crown='alfiz-arches', motif='chain', unit=9),
    'leadership': dict(seed=104, crown='none', motif='beads', unit=8, gypsum=(240, 233, 214)),
}
QAM = {
    'ai': ('star', {'red': 5, 'green': 2, 'yellow': 2, 'blue': 1.5, 'clear': 0.6}, 7),
    'mobile': ('fan', {'blue': 5, 'teal': 1.5, 'yellow': 2, 'red': 1, 'clear': 0.6}, 8),
    'web': ('lattice', {'green': 5, 'yellow': 2, 'teal': 1.2, 'red': 1, 'clear': 0.8}, 9),
    'leadership': ('floral', {'yellow': 4, 'orange': 3, 'red': 1.5, 'green': 1.2, 'clear': 0.5}, 10),
}

if __name__ == '__main__':
    which = sys.argv[2] if len(sys.argv) > 2 else 'all'
    for k in DOORS:
        if which in ('all', 'leaf'): door_leaf(DOORS[k], name=f'door-{k}-leaf.webp')
        if which in ('all', 'frame'): frame(FRAMES[k], name=f'door-{k}-frame.webp')
        if which in ('all', 'qam'):
            p, wts, sd = QAM[k]; qamariya(160, p, wts, sd, name=f'qamariya-{k}.webp')
    if which in ('all', 'hero'):
        hero_arch(name='hero-arch.webp')
        qamariya(300, 'star', {'red': 4, 'green': 3, 'yellow': 3, 'blue': 2.5, 'purple': 1, 'clear': 0.5}, 3, name='qamariya-hero.webp')
    print('done', sorted(os.listdir(OUT)))
