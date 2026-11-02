// CIF values can contain quoted text and multiline fields.
export function tokenizeCif(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    if (/\s/.test(text[i])) {
      i++;
      continue;
    }
    if (text[i] === "#") {
      while (i < text.length && text[i] !== "\n") i++;
      continue;
    }
    const start = i;
    if (text[i] === ";" && (i === 0 || text[i - 1] === "\n")) {
      i++;
      const end = text.indexOf("\n;", i);
      if (end < 0)
        throw new Error("The coordinate file has an unfinished text field.");
      tokens.push({ value: text.slice(i, end), quoted: true });
      i = end + 2;
    } else if (text[i] === '"' || text[i] === "'") {
      const quote = text[i++];
      const begin = i;
      while (
        i < text.length &&
        !(
          text[i] === quote &&
          (i + 1 === text.length || /\s/.test(text[i + 1]))
        )
      )
        i++;
      if (i === text.length)
        throw new Error("The coordinate file has an unfinished quoted value.");
      tokens.push({ value: text.slice(begin, i), quoted: true });
      i++;
    } else {
      while (i < text.length && !/\s/.test(text[i])) i++;
      tokens.push({ value: text.slice(start, i), quoted: false });
    }
  }
  return tokens;
}

export function readRnaCoordinates(text) {
  const tokens = tokenizeCif(text);
  const tables = { _entity_poly: [], _atom_site: [] };
  const isControl = (token) =>
    token &&
    !token.quoted &&
    (token.value.startsWith("_") ||
      /^(loop_|stop_|data_|save_)/i.test(token.value));
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i++];
    if (!token.quoted && token.value === "loop_") {
      const fields = [];
      while (tokens[i] && !tokens[i].quoted && tokens[i].value.startsWith("_"))
        fields.push(tokens[i++].value);
      if (!fields.length)
        throw new Error("The coordinate file contains an empty table.");
      const category = fields[0].split(".")[0];
      while (i < tokens.length && !isControl(tokens[i])) {
        const row = tokens.slice(i, i + fields.length);
        if (row.length !== fields.length || row.some(isControl))
          throw new Error("The coordinate file contains an incomplete row.");
        if (tables[category])
          tables[category].push(
            Object.fromEntries(
              fields.map((field, j) => [field.split(".")[1], row[j].value]),
            ),
          );
        i += fields.length;
      }
    } else if (!token.quoted && token.value.startsWith("_")) {
      const [category, field] = token.value.split(".");
      if (!tokens[i])
        throw new Error("The coordinate file contains a missing value.");
      if (tables[category]) {
        if (!tables[category][0]) tables[category][0] = {};
        tables[category][0][field] = tokens[i].value;
      }
      i++;
    }
  }
  const rnaEntities = new Set(
    tables._entity_poly
      .filter((row) => row.type === "polyribonucleotide")
      .map((row) => row.entity_id),
  );
  if (!rnaEntities.size)
    throw new Error("This entry has no RNA polymer. Choose an RNA structure.");
  const chains = new Map();
  let firstModel;
  for (const atom of tables._atom_site) {
    if (
      !rnaEntities.has(atom.label_entity_id) ||
      !["C4'", "C4*"].includes(atom.label_atom_id)
    )
      continue;
    firstModel ??= atom.pdbx_PDB_model_num ?? "1";
    if ((atom.pdbx_PDB_model_num ?? "1") !== firstModel) continue;
    const position = [atom.Cartn_x, atom.Cartn_y, atom.Cartn_z].map(Number);
    if (!position.every(Number.isFinite)) continue;
    const chain = atom.label_asym_id;
    if (!chains.has(chain))
      chains.set(chain, {
        id: chain,
        authorId: atom.auth_asym_id,
        atoms: new Map(),
      });
    const key = `${chain}:${atom.label_seq_id}:${atom.pdbx_PDB_ins_code}`;
    const old = chains.get(chain).atoms.get(key);
    const point = {
      key,
      residue: Number(atom.auth_seq_id),
      sequence: Number(atom.label_seq_id),
      position,
      occupancy: Number(atom.occupancy) || 0,
    };
    if (!old || point.occupancy > old.occupancy)
      chains.get(chain).atoms.set(key, point);
  }
  const result = [...chains.values()]
    .filter((chain) => chain.atoms.size >= 2)
    .map((chain) => {
      const points = [...chain.atoms.values()].sort(
        (a, b) => a.sequence - b.sequence,
      );
      const center = [0, 1, 2].map(
        (axis) =>
          points.reduce((sum, point) => sum + point.position[axis], 0) /
          points.length,
      );
      return {
        id: chain.id,
        authorId: chain.authorId,
        points: points.map((point) => ({
          ...point,
          position: point.position.map((value, axis) => value - center[axis]),
        })),
      };
    });
  if (!result.length)
    throw new Error("No usable RNA C4′ coordinates were found in this entry.");
  return { chains: result, model: firstModel };
}
