export function projectStructure(points, degrees) {
  const radians = (degrees * Math.PI) / 180;
  const radius = Math.max(
    ...points.map((point) => Math.hypot(...point.position)),
  );
  const scale = 190 / radius;
  const projected = points.map((point) => {
    const [x, y, z] = point.position;
    return {
      x: 320 + (x * Math.cos(radians) + z * Math.sin(radians)) * scale,
      y: 250 + y * scale,
      z: -x * Math.sin(radians) + z * Math.cos(radians),
      residue: point.residue,
    };
  });
  const shapes = [];

  projected.forEach((point, index) => {
    if (index > 0) {
      const previous = projected[index - 1];
      shapes.push({
        id: `line-${point.residue}`,
        kind: "line",
        x1: previous.x,
        y1: previous.y,
        x2: point.x,
        y2: point.y,
        depth: (point.z + previous.z) / 2,
      });
    }
    shapes.push({
      ...point,
      id: `point-${point.residue}`,
      kind: "circle",
      depth: point.z + 0.1,
    });
  });

  // Draw the front last.
  return shapes.sort((a, b) => a.depth - b.depth);
}
