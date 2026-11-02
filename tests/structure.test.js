import assert from "node:assert/strict";
import test from "node:test";
import points from "../src/data/structure.json" with { type: "json" };
import { projectStructure } from "../src/utils/projectStructure.js";

test("the real structure contains one C4′ point for each of 76 residues", () => {
  assert.equal(points.length, 76);
  assert.deepEqual(
    points.map((point) => point.residue),
    Array.from({ length: 76 }, (_, index) => index + 1),
  );
});

test("a quarter turn changes horizontal position and preserves height", () => {
  const point = [{ residue: 1, position: [1, 2, 0] }];
  const initial = projectStructure(point, 0)[0];
  const rotated = projectStructure(point, 90)[0];
  assert.ok(initial.x > 320);
  assert.ok(Math.abs(rotated.x - 320) < 1e-10);
  assert.equal(rotated.y, initial.y);
  assert.ok(Math.abs(rotated.z + 1) < 1e-10);
});

test("a full turn returns every real point to its initial screen position", () => {
  const initial = projectStructure(points, 0).filter(
    (shape) => shape.kind === "circle",
  );
  const turned = projectStructure(points, 360).filter(
    (shape) => shape.kind === "circle",
  );
  for (const shape of initial) {
    const other = turned.find((item) => item.id === shape.id);
    assert.ok(Math.abs(shape.x - other.x) < 1e-10);
    assert.equal(shape.y, other.y);
  }
});

test("every angle has 76 points, 75 consecutive links, and stable unique keys", () => {
  const ids = projectStructure(points, 0)
    .map((shape) => shape.id)
    .sort();
  for (const angle of [-180, -90, 0, 45, 90, 180]) {
    const shapes = projectStructure(points, angle);
    assert.equal(shapes.filter((shape) => shape.kind === "circle").length, 76);
    assert.equal(shapes.filter((shape) => shape.kind === "line").length, 75);
    assert.equal(new Set(shapes.map((shape) => shape.id)).size, 151);
    assert.deepEqual(shapes.map((shape) => shape.id).sort(), ids);
    assert.ok(shapes.every((shape) => Number.isFinite(shape.depth)));
  }
});

test("depth order draws back first and uses the midpoint for each link", () => {
  for (const angle of [-180, -90, 0, 45, 90, 180]) {
    const shapes = projectStructure(points, angle);
    assert.ok(
      shapes.every(
        (shape, index) => index === 0 || shapes[index - 1].depth <= shape.depth,
      ),
    );
    const circles = shapes.filter((shape) => shape.kind === "circle");
    for (const link of shapes.filter((shape) => shape.kind === "line")) {
      const residue = Number(link.id.slice(5));
      const first = circles.find((circle) => circle.residue === residue - 1);
      const last = circles.find((circle) => circle.residue === residue);
      assert.equal(link.depth, (first.z + last.z) / 2);
      assert.equal(first.depth, first.z + 0.1);
    }
  }
});
