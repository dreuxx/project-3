export const structureIds = ["1EHZ", "1TRA", "1GRZ"];
const endpoint = "https://data.rcsb.org/rest/v1/core/entry/";

export async function fetchStructures({ signal, simulateError = false }) {
  const ids = simulateError ? ["XXXX"] : structureIds;
  return Promise.all(
    ids.map(async (id) => {
      const response = await fetch(endpoint + id, { signal });
      if (!response.ok) {
        if (response.status === 404)
          throw new Error("A structure could not be found (404).");
        if (response.status === 429)
          throw new Error("The data service is busy. Wait a moment and retry.");
        throw new Error(
          `The data service returned an error (${response.status}).`,
        );
      }
      const entry = await response.json();
      if (entry.rcsb_id !== id || typeof entry.struct?.title !== "string") {
        throw new Error(
          "The data service returned an unexpected response. Please retry.",
        );
      }
      return {
        id: entry.rcsb_id,
        title: entry.struct.title,
        method: entry.exptl?.[0]?.method ?? "Not reported",
        resolution: entry.rcsb_entry_info?.resolution_combined?.[0] ?? null,
        released:
          entry.rcsb_accession_info?.initial_release_date?.slice(0, 10) ??
          "Not reported",
      };
    }),
  );
}
