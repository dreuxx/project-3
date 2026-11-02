import { readRnaCoordinates } from "./mmcif.js";
const cache = new Map();
export function normalizePdbId(value) {
  const id = value.trim().toUpperCase();
  if (!/^[1-9][A-Z0-9]{3}$/.test(id))
    throw new Error("Enter a four-character PDB code, such as 1EHZ.");
  return id;
}
export async function fetchRnaModel(id, signal, refresh = false) {
  id = normalizePdbId(id);
  if (!refresh && cache.has(id)) return cache.get(id);
  const [metadataResponse, coordinatesResponse] = await Promise.all([
    fetch(`https://data.rcsb.org/rest/v1/core/entry/${id}`, { signal }),
    fetch(`https://files.rcsb.org/download/${id}.cif`, { signal }),
  ]);
  for (const response of [metadataResponse, coordinatesResponse]) {
    if (!response.ok)
      throw new Error(
        response.status === 404
          ? `PDB ${id} could not be found (404).`
          : `The structure service returned an error (${response.status}). Please retry.`,
      );
  }
  const entry = await metadataResponse.json();
  if (typeof entry?.struct?.title !== "string")
    throw new Error("The structure metadata could not be read.");
  const coordinates = readRnaCoordinates(await coordinatesResponse.text());
  const data = {
    entry: {
      id,
      title: entry.struct.title,
      resolution: entry.rcsb_entry_info?.resolution_combined?.[0] ?? null,
      method: entry.exptl?.[0]?.method ?? "Not reported",
      released:
        entry.rcsb_accession_info?.initial_release_date?.slice(0, 10) ??
        "Not reported",
    },
    ...coordinates,
  };
  signal.throwIfAborted();
  if (cache.size >= 5) cache.delete(cache.keys().next().value);
  cache.set(id, data);
  return data;
}
