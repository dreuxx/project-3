"""Rebuild the illustrations from the included PDB coordinates."""

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def subtract(a, b):
    return [x - y for x, y in zip(a, b)]


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def unit(vector):
    length = math.sqrt(dot(vector, vector))
    return [value / length for value in vector]


def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]]


atoms = []
backbone = []
for line in (ROOT / "public/assets/data/1EHZ.pdb").read_text().splitlines():
    if not line.startswith(("ATOM  ", "HETATM")) or line[21] != "A":
        continue
    residue = int(line[22:26])
    if not 1 <= residue <= 76:
        continue
    atom = {
        "residue": residue,
        "element": line[76:78].strip(),
        "position": [float(line[30:38]), float(line[38:46]), float(line[46:54])],
    }
    atoms.append(atom)
    if line[12:16].strip() == "C4'":
        backbone.append(atom)

assert len(backbone) == 76
center = [sum(a["position"][i] for a in atoms) / len(atoms) for i in range(3)]
vertical = unit(subtract(backbone[74]["position"], backbone[34]["position"]))
elbow = subtract(backbone[18]["position"], center)
horizontal = unit(subtract(elbow, [dot(elbow, vertical) * v for v in vertical]))
normal = cross(horizontal, vertical)
angle = math.radians(-24)


def orient(position):
    point = subtract(position, center)
    x, y, z = dot(point, horizontal), -dot(point, vertical), dot(point, normal)
    return [x * math.cos(angle) - y * math.sin(angle),
            x * math.sin(angle) + y * math.cos(angle), z]


points = [{"residue": atom["residue"],
           "position": [round(value, 4) for value in orient(atom["position"])]}
          for atom in backbone]
(ROOT / "src/data/structure.json").write_text(json.dumps(points, indent=2) + "\n")


def svg_open(width, height, title, description):
    return [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
            f'viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
            f'<title id="title">{title}</title><desc id="desc">{description}</desc>']


svg = svg_open(720, 720, "Yeast phenylalanine tRNA",
               "Representation of the 1652 atoms in the RNA chain A of PDB 1EHZ. "
               "The anticodon, residues 34 to 36, appears in orange.")
svg.append('<defs>')
for name, light, mid, dark in [
    ("green", "#d5dea2", "#829254", "#354d32"),
    ("orange", "#f3d4a3", "#c37c4d", "#7a3e27"),
]:
    svg.append(f'<radialGradient id="{name}" cx="32%" cy="25%" r="75%">'
               f'<stop offset="0" stop-color="{light}"/>'
               f'<stop offset=".5" stop-color="{mid}"/>'
               f'<stop offset="1" stop-color="{dark}"/></radialGradient>')
svg.append('</defs>')
projected = sorted([(orient(atom["position"]), atom) for atom in atoms], key=lambda pair: pair[0][2])
extent = max(max(abs(point[0]), abs(point[1])) for point, _ in projected)
scale = 275 / (extent + 2)
for (x, y, z), atom in projected:
    radius = {"C": 1.7, "N": 1.55, "O": 1.52, "P": 1.8}.get(atom["element"], 1.7)
    color = "orange" if 34 <= atom["residue"] <= 36 else "green"
    svg.append(f'<circle cx="{360 + x * scale:.2f}" cy="{350 + y * scale:.2f}" '
               f'r="{radius * scale:.2f}" fill="url(#{color})"/>')
svg.append('</svg>')
(ROOT / "public/assets/images/trna-molecule.svg").write_text("\n".join(svg))

svg = svg_open(640, 500, "Path of the tRNA strand",
               "The 76 points follow the C4′ carbons of PDB 1EHZ; "
               "the lines connect consecutive nucleotides.")
radius = max(math.sqrt(dot(point["position"], point["position"])) for point in points)
scale = 190 / radius
items = []
for index, point in enumerate(points):
    x, y, z = point["position"]
    x, y = 320 + x * scale, 250 + y * scale
    if index:
        previous = points[index - 1]["position"]
        items.append(((z + previous[2]) / 2,
                      f'<line x1="{320 + previous[0] * scale:.2f}" y1="{250 + previous[1] * scale:.2f}" '
                      f'x2="{x:.2f}" y2="{y:.2f}" stroke="#a8bd82" stroke-width="7" stroke-linecap="round"/>'))
    items.append((z + .1, f'<circle cx="{x:.2f}" cy="{y:.2f}" r="5" '
                  'fill="#dce7b8" stroke="#273e32" stroke-width="1.5"/>'))
svg.extend(markup for _, markup in sorted(items, key=lambda item: item[0]))
svg.append('</svg>')
(ROOT / "public/assets/images/trna-backbone.svg").write_text("\n".join(svg))
print(f"Built two SVGs and structure.json from {len(atoms)} atoms and {len(points)} C4′ positions.")
