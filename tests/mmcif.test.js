import test from "node:test";
import assert from "node:assert/strict";
import { tokenizeCif, readRnaCoordinates } from "../src/services/mmcif.js";
import { projectStructure } from "../src/utils/projectStructure.js";
import { normalizePdbId } from "../src/services/rnaModel.js";
const header = `data_demo
_entity_poly.entity_id 1
_entity_poly.type polyribonucleotide
loop_
_atom_site.label_entity_id
_atom_site.label_atom_id
_atom_site.label_asym_id
_atom_site.auth_asym_id
_atom_site.label_seq_id
_atom_site.auth_seq_id
_atom_site.pdbx_PDB_ins_code
_atom_site.Cartn_x
_atom_site.Cartn_y
_atom_site.Cartn_z
_atom_site.occupancy
_atom_site.pdbx_PDB_model_num
`;
const row = (seq, x, model = 1, occupancy = 1, chain = "A", auth = seq) =>
  `1 "C4'" ${chain} ${chain} ${seq} ${auth} ? ${x} 0 0 ${occupancy} ${model}\n`;
test("CIF tokenizer preserves prime atoms, quoted controls and multiline values", () => {
  assert.deepEqual(
    tokenizeCif(`C4' "C4'" '_field'\n;multi\nline\n;\n# comment\n`).map(
      (x) => x.value,
    ),
    ["C4'", "C4'", "_field", "multi\nline"],
  );
  assert.throws(() => tokenizeCif("'unfinished"), /unfinished/);
});
test("centers actual coordinates and selects one atom per residue in the first model", () => {
  const { chains } = readRnaCoordinates(
    header + row(1, 0) + row(1, 100, 1, 0.2) + row(2, 6) + row(1, 200, 2),
  );
  assert.equal(chains[0].points.length, 2);
  assert.deepEqual(
    chains[0].points.map((p) => p.position[0]),
    [-3, 3],
  );
});
test("each chain has its own points and duplicate author numbering keeps distinct keys", () => {
  const { chains } = readRnaCoordinates(
    header +
      row(1, 0, 1, 1, "A", 1) +
      row(2, 6, 1, 1, "A", 1) +
      row(1, 2, 1, 1, "B") +
      row(2, 8, 1, 1, "B"),
  );
  assert.equal(chains.length, 2);
  const shapes = projectStructure(chains[0].points, 30);
  assert.equal(new Set(shapes.map((s) => s.id)).size, 3);
});
test("does not connect across unresolved sequence gaps", () => {
  const { chains } = readRnaCoordinates(header + row(1, 0) + row(3, 12));
  assert.equal(
    projectStructure(chains[0].points, 0).filter((s) => s.kind === "line")
      .length,
    0,
  );
});
test("rejects non-RNA and incomplete coordinate tables", () => {
  assert.throws(
    () =>
      readRnaCoordinates(
        header.replace("polyribonucleotide", "polydeoxyribonucleotide") +
          row(1, 0) +
          row(2, 6),
      ),
    /no RNA/,
  );
  assert.throws(() => readRnaCoordinates(header + "1"), /incomplete/);
});
test("normalizes user codes and rejects arbitrary URLs and invalid codes", () => {
  assert.equal(normalizePdbId(" 1tra "), "1TRA");
  for (const input of ["", "XXXX", "https://example.com", "1EHZ/other"])
    assert.throws(() => normalizePdbId(input), /four-character/);
});
