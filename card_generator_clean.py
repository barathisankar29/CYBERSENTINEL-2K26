
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from collections import deque

W = 800
H = 1000

def get_font(size, bold=True, serif=False):
    try:
        if serif:
            font_path = r'C:\Windows\Fonts\georgiab.ttf' if bold else r'C:\Windows\Fonts\georgia.ttf'
        elif bold:
            font_path = r'C:\Windows\Fonts\arialbd.ttf'
        else:
            font_path = r'C:\Windows\Fonts\arial.ttf'
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def extract_alpha_cutout(im_path, tolerance=22):
    im = Image.open(im_path)
    if im.mode == 'RGBA':
        alpha = im.split()[-1]
        if alpha.getextrema()[0] < 200:
            return im
    
    im_rgb = im.convert('RGB')
    w, h = im_rgb.size
    arr = np.array(im_rgb, dtype=np.int32)
    dist = np.max(arr, axis=2)
    
    mask = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        if dist[0, x] <= tolerance:
            mask[0, x] = True
            q.append((0, x))
    for y in range(h):
        if dist[y, 0] <= tolerance:
            mask[y, 0] = True
            q.append((y, 0))
        if dist[y, w-1] <= tolerance:
            mask[y, w-1] = True
            q.append((y, w-1))

    while q:
        y, x = q.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not mask[ny, nx]:
                if dist[ny, nx] <= tolerance:
                    mask[ny, nx] = True
                    q.append((ny, nx))
                    
    fg_mask = (~mask).astype(np.uint8) * 255
    alpha_img = Image.fromarray(fg_mask)
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=1.5))
    
    im_rgba = im_rgb.convert('RGBA')
    im_rgba.putalpha(alpha_img)
    return im_rgba

def draw_star(draw, cx, cy, r_outer, r_inner, fill_color):
    points = []
    for i in range(8):
        angle = i * math.pi / 4 - math.pi / 2
        r = r_outer if i % 2 == 0 else r_inner
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(points, fill=fill_color)

def draw_tcg_filigree(draw, w, h, primary_hex, accent_hex, secondary_hex):
    m = 28
    r_corner = 22
    
    # Outer border
    draw.rounded_rectangle([m, m, w - m, h - m], radius=r_corner, outline=accent_hex, width=4)
    # Inner border
    m_in = m + 14
    draw.rounded_rectangle([m_in, m_in, w - m_in, h - m_in], radius=r_corner - 6, outline=secondary_hex, width=2)
    
    # Greek key / Meander corners
    corner_len = 84
    fret_w = 2
    
    # Top-Left Meander
    x0, y0 = m + 10, m + 10
    draw.line([(x0, y0 + corner_len), (x0, y0), (x0 + corner_len, y0)], fill=primary_hex, width=fret_w)
    draw.line([(x0 + corner_len, y0), (x0 + corner_len, y0 + 22), (x0 + 26, y0 + 22), (x0 + 26, y0 + corner_len), (x0, y0 + corner_len)], fill=primary_hex, width=fret_w)
    draw.rectangle([x0 + 36, y0 + 32, x0 + 50, y0 + 46], outline=primary_hex, width=fret_w)
    
    # Top-Right Meander
    rx0, ry0 = w - m - 10, m + 10
    draw.line([(rx0, ry0 + corner_len), (rx0, ry0), (rx0 - corner_len, ry0)], fill=primary_hex, width=fret_w)
    draw.line([(rx0 - corner_len, ry0), (rx0 - corner_len, ry0 + 22), (rx0 - 26, ry0 + 22), (rx0 - 26, ry0 + corner_len), (rx0, ry0 + corner_len)], fill=primary_hex, width=fret_w)
    draw.rectangle([rx0 - 50, ry0 + 32, rx0 - 36, ry0 + 46], outline=primary_hex, width=fret_w)

    # Bottom-Left Meander
    bx0, by0 = m + 10, h - m - 10
    draw.line([(bx0, by0 - corner_len), (bx0, by0), (bx0 + corner_len, by0)], fill=primary_hex, width=fret_w)
    draw.line([(bx0 + corner_len, by0), (bx0 + corner_len, by0 - 22), (bx0 + 26, by0 - 22), (bx0 + 26, by0 - corner_len), (bx0, by0 - corner_len)], fill=primary_hex, width=fret_w)
    draw.rectangle([bx0 + 36, by0 - 46, bx0 + 50, by0 - 32], outline=primary_hex, width=fret_w)

    # Bottom-Right Meander
    brx0, brry0 = w - m - 10, h - m - 10
    draw.line([(brx0, brry0 - corner_len), (brx0, brry0), (brx0 - corner_len, brry0)], fill=primary_hex, width=fret_w)
    draw.line([(brx0 - corner_len, brry0), (brx0 - corner_len, brry0 - 22), (brx0 - 26, brry0 - 22), (brx0 - 26, brry0 - corner_len), (brx0, brry0 - corner_len)], fill=primary_hex, width=fret_w)
    draw.rectangle([brx0 - 50, brry0 - 46, brx0 - 36, brry0 - 32], outline=primary_hex, width=fret_w)

    # Side decorative waist curves and diamond stars
    mid_y = h // 2
    draw.arc([m - 16, mid_y - 75, m + 36, mid_y + 75], start=270, end=90, fill=primary_hex, width=2)
    draw.arc([m - 10, mid_y - 55, m + 26, mid_y + 55], start=270, end=90, fill=accent_hex, width=1)
    draw_star(draw, m + 36, mid_y, 11, 3.5, primary_hex)
    
    draw.arc([w - m - 36, mid_y - 75, w - m + 16, mid_y + 75], start=90, end=270, fill=primary_hex, width=2)
    draw.arc([w - m - 26, mid_y - 55, w - m + 10, mid_y + 55], start=90, end=270, fill=accent_hex, width=1)
    draw_star(draw, w - m - 36, mid_y, 11, 3.5, primary_hex)
    
    # Sparkle stars in corners and margins
    draw_star(draw, w // 2, m + 22, 9, 3, primary_hex)
    draw_star(draw, m + 140, m + 32, 6, 2, secondary_hex)
    draw_star(draw, w - m - 140, m + 32, 6, 2, secondary_hex)
    draw_star(draw, m + 140, h - m - 32, 6, 2, secondary_hex)
    draw_star(draw, w - m - 140, h - m - 32, 6, 2, secondary_hex)

def draw_mana_orb(base, cx, cy, num_str, primary_rgb, accent_rgb):
    draw = ImageDraw.Draw(base)
    r = 38
    draw.ellipse([cx - r - 4, cy - r - 4, cx + r + 4, cy + r + 4], outline=accent_rgb, width=3)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(10, 8, 20, 255), outline=primary_rgb, width=2)
    
    orb = Image.new('RGBA', (r*2, r*2), (0,0,0,0))
    odraw = ImageDraw.Draw(orb)
    for rad in range(r - 2, 0, -2):
        frac = 1.0 - (rad / r)
        alpha = int(frac * 220)
        cr = int(primary_rgb[0] * frac + 255 * (1 - frac) * 0.4)
        cg = int(primary_rgb[1] * frac + 255 * (1 - frac) * 0.4)
        cb = int(primary_rgb[2] * frac + 255 * (1 - frac) * 0.4)
        odraw.ellipse([r - rad, r - rad, r + rad, r + rad], fill=(cr, cg, cb, alpha))
    orb = orb.filter(ImageFilter.GaussianBlur(radius=2))
    base.paste(orb, (cx - r, cy - r), orb)
    
    draw = ImageDraw.Draw(base)
    f_num = get_font(36, bold=True, serif=True)
    bbox = f_num.getbbox(num_str)
    nw = bbox[2] - bbox[0]
    nh = bbox[3] - bbox[1]
    draw.text((cx - nw // 2, cy - nh // 2 - 2), num_str, fill=(255, 255, 255), font=f_num)
    
    badge_y = cy + r + 9
    draw.ellipse([cx - 11, badge_y - 11, cx + 11, badge_y + 11], fill=(16, 10, 28, 255), outline=accent_rgb, width=2)
    draw_star(draw, cx, badge_y, 7, 2, primary_rgb)

def draw_nameplate(base, w, h, name_str, primary_hex, accent_hex, secondary_hex):
    banner_w = int(w * 0.84)
    banner_h = 84
    bx0 = (w - banner_w) // 2
    by0 = int(h * 0.845)
    bx1 = bx0 + banner_w
    by1 = by0 + banner_h
    
    c_indent = 20
    poly = [
        (bx0, by0 + banner_h // 2),
        (bx0 + c_indent, by0),
        (bx1 - c_indent, by0),
        (bx1, by0 + banner_h // 2),
        (bx1 - c_indent, by1),
        (bx0 + c_indent, by1)
    ]
    
    plaque = Image.new('RGBA', (w, h), (0,0,0,0))
    pdraw = ImageDraw.Draw(plaque)
    pdraw.polygon(poly, fill=(6, 4, 16, 245), outline=accent_hex)
    
    poly_in = [
        (bx0 + 6, by0 + banner_h // 2),
        (bx0 + c_indent + 4, by0 + 4),
        (bx1 - c_indent - 4, by0 + 4),
        (bx1 - 6, by0 + banner_h // 2),
        (bx1 - c_indent - 4, by1 - 4),
        (bx0 + c_indent + 4, by1 - 4)
    ]
    pdraw.polygon(poly_in, outline=secondary_hex)
    
    draw_star(pdraw, bx0 + 16, by0 + banner_h // 2, 7, 2, primary_hex)
    draw_star(pdraw, bx1 - 16, by0 + banner_h // 2, 7, 2, primary_hex)
    
    base.alpha_composite(plaque)
    
    draw = ImageDraw.Draw(base)
    max_txt_w = banner_w - 90
    font_size = 42
    while font_size > 24:
        f_name = get_font(font_size, bold=True, serif=True)
        bbox = f_name.getbbox(name_str)
        tw = bbox[2] - bbox[0]
        if tw <= max_txt_w:
            break
        font_size -= 2

    bbox = f_name.getbbox(name_str)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (w - tw) // 2
    ty = by0 + (banner_h - th) // 2 - 4
    
    draw.text((tx + 2, ty + 2), name_str, fill=(0, 0, 0, 245), font=f_name)
    draw.text((tx, ty), name_str, fill=(255, 255, 255), font=f_name)


def create_tcg_card(cfg):
    w, h = W, H
    base = Image.new('RGBA', (w, h), (7, 6, 12, 255))
    
    # 1. Radial glow aura behind the guest
    aura = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    aura_draw = ImageDraw.Draw(aura)
    cx, cy = w // 2, int(h * 0.44)
    r_max = int(w * 0.58)
    pr, pg, pb = cfg['primary_rgb']
    ar, ag, ab = cfg['accent_rgb']
    
    for r in range(r_max, 20, -14):
        frac = 1.0 - (r / r_max)
        alpha = int((frac ** 1.5) * 175)
        cr = int(pr * (1 - frac) + ar * frac)
        cg = int(pg * (1 - frac) + ag * frac)
        cb = int(pb * (1 - frac) + ab * frac)
        aura_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(cr, cg, cb, alpha))
        
    aura = aura.filter(ImageFilter.GaussianBlur(radius=32))
    base = Image.alpha_composite(base, aura)
    
    # 2. Extract & paste guest cutout - BIG!
    cutout = extract_alpha_cutout(cfg['src_path'])
    # Scale person to fill card widely and prominently
    target_person_h = int(h * 0.82)
    scale = target_person_h / cutout.height
    new_pw = int(cutout.width * scale)
    new_ph = int(cutout.height * scale)
    cutout_resized = cutout.resize((new_pw, new_ph), Image.Resampling.LANCZOS)
    
    px = (w - new_pw) // 2 + cfg.get('offset_x', 0)
    py = int(h * 0.12) + cfg.get('offset_y', 0)
    
    shadow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    c_alpha = cutout_resized.split()[-1]
    colored_glow = Image.new('RGBA', (new_pw, new_ph), (pr, pg, pb, 220))
    colored_glow.putalpha(c_alpha)
    shadow.paste(colored_glow, (px, py), colored_glow)
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=20))
    base = Image.alpha_composite(base, shadow)
    
    base.paste(cutout_resized, (px, py), cutout_resized)
    
    # 3. Vignette at bottom so nameplate sits over clean darkness
    vignette = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    v_top = int(h * 0.76)
    for y in range(v_top, h):
        factor = (y - v_top) / (h - v_top)
        a = int((factor ** 1.3) * 230)
        v_draw.line([(0, y), (w, y)], fill=(6, 4, 14, a), width=1)
    base = Image.alpha_composite(base, vignette)
    
    # 4. Draw Filigree & Meander Border
    draw = ImageDraw.Draw(base)
    draw_tcg_filigree(draw, w, h, cfg['primary_hex'], cfg['accent_hex'], cfg['secondary_hex'])
    
    # 5. Top-Left Mana Orb
    draw_mana_orb(base, 80, 80, cfg['mana_num'], cfg['primary_rgb'], cfg['accent_rgb'])
    
    # 6. Bottom Nameplate (ONLY NAME!)
    draw_nameplate(base, w, h, cfg['name'], cfg['primary_hex'], cfg['accent_hex'], cfg['secondary_hex'])
    
    # Save image
    out_path = cfg['dest_path']
    base.convert('RGB').save(out_path, quality=96)
    print(f'Generated TCG Card: {out_path}')

tcg_configs = [
    {
        'name': 'KPY NAVEEN',
        'mana_num': '1',
        'src_path': 'public/assets/city/navigation/guests/guest_01_man_black.png',
        'dest_path': 'public/assets/city/navigation/guests/guest-tcg-01.jpg',
        'primary_hex': '#38bdf8',
        'primary_rgb': (56, 189, 248),
        'accent_hex': '#00f0ff',
        'accent_rgb': (0, 240, 255),
        'secondary_hex': '#93c5fd',
        'offset_y': 10
    },
    {
        'name': 'RAPPER HEMI',
        'mana_num': '2',
        'src_path': 'public/assets/city/navigation/guests/guest_02_singer_yellow.png',
        'dest_path': 'public/assets/city/navigation/guests/guest-tcg-02.jpg',
        'primary_hex': '#ffd700',
        'primary_rgb': (255, 215, 0),
        'accent_hex': '#ffea85',
        'accent_rgb': (255, 234, 133),
        'secondary_hex': '#f59e0b',
        'offset_y': 25
    },
    {
        'name': 'DANCER JYOSTNA',
        'mana_num': '3',
        'src_path': 'public/assets/city/navigation/guests/guest_03_lady_black.png',
        'dest_path': 'public/assets/city/navigation/guests/guest-tcg-03.jpg',
        'primary_hex': '#f472b6',
        'primary_rgb': (244, 114, 182),
        'accent_hex': '#ff007f',
        'accent_rgb': (255, 0, 127),
        'secondary_hex': '#c084fc',
        'offset_y': 0
    },
    {
        'name': 'DANCER RANJANI',
        'mana_num': '4',
        'src_path': 'public/assets/city/navigation/guests/guest_04_lady_saree.png',
        'dest_path': 'public/assets/city/navigation/guests/guest-tcg-04.jpg',
        'primary_hex': '#00ffaa',
        'primary_rgb': (0, 255, 170),
        'accent_hex': '#6ee7b7',
        'accent_rgb': (110, 231, 183),
        'secondary_hex': '#00f0ff',
        'offset_y': 15
    },
    {
        'name': 'SINGER DHARSHANA',
        'mana_num': '5',
        'src_path': 'public/assets/city/navigation/guests/guest_05_lady_peach.png',
        'dest_path': 'public/assets/city/navigation/guests/guest-tcg-05.jpg',
        'primary_hex': '#c084fc',
        'primary_rgb': (192, 132, 252),
        'accent_hex': '#e879f9',
        'accent_rgb': (232, 121, 249),
        'secondary_hex': '#f472b6',
        'offset_y': 10
    }
]

for cfg in tcg_configs:
    create_tcg_card(cfg)

print('All 5 TCG cards generated successfully!')
