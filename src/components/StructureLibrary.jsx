import { useState } from "react";
import useRnaStructures from "../hooks/useRnaStructures";
import StructureCard from "./StructureCard";

export default function StructureLibrary({
  selectedStructure,
  onSelectStructure,
}) {
  const [simulateError, setSimulateError] = useState(false);
  const [search, setSearch] = useState("");
  const [maxResolution, setMaxResolution] = useState("all");
  const { data, loading, error, retry } = useRnaStructures(simulateError);
  const query = search.trim().toLowerCase();
  const filtered = data.filter(
    (structure) =>
      `${structure.id} ${structure.title}`.toLowerCase().includes(query) &&
      (maxResolution === "all" ||
        (structure.resolution !== null &&
          structure.resolution <= Number(maxResolution))),
  );

  return (
    <section
      className="section page-width"
      id="biblioteca"
      aria-labelledby="library-title"
    >
      <div className="section-heading">
        <p className="eyebrow">04 / From the archive</p>
        <h2 id="library-title">More strands, more stories.</h2>
        <p>
          A small collection of RNA structures. Their experimental records are
          fetched live from RCSB Protein Data Bank.
        </p>
      </div>
      <div className="archive-toolbar">
        <label htmlFor="structure-search">
          Search this collection
          <input
            id="structure-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="PDB code or title"
          />
        </label>
        <label htmlFor="resolution-filter">
          Resolution
          <select
            id="resolution-filter"
            value={maxResolution}
            onChange={(event) => setMaxResolution(event.target.value)}
          >
            <option value="all">All resolutions</option>
            <option value="2">2 Å or better</option>
            <option value="3">3 Å or better</option>
          </select>
        </label>
        <button type="button" onClick={retry}>
          Refresh collection
        </button>
      </div>
      <details className="error-demo">
        <summary>Connection check / Probar error</summary>
        <label>
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(event) => setSimulateError(event.target.checked)}
          />
          Use a missing record (XXXX)
        </label>
        <p>
          This makes a real request for a missing record. Uncheck to load the
          collection again. Retry repeats the current request.
        </p>
      </details>
      <div aria-busy={loading}>
        {loading ? (
          <p className="api-message" role="status">
            Loading structures from RCSB PDB…
          </p>
        ) : error ? (
          <div className="api-message api-error" role="alert">
            <h3>We could not load the collection.</h3>
            <p>{error}</p>
            <button type="button" onClick={retry}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <p className="archive-count" role="status">
              {filtered.length} of {data.length} structures
            </p>
            {filtered.length === 0 ? (
              <div className="api-message">
                <h3>No matching structures.</h3>
                <p>Try another code or remove the resolution filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setMaxResolution("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="structure-grid">
                {filtered.map((structure) => (
                  <StructureCard
                    key={structure.id}
                    structure={structure}
                    selected={selectedStructure?.id === structure.id}
                    onSelect={onSelectStructure}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <p className="margin-note">
        Source: RCSB PDB Data API · Three curated records. Search filters this
        collection.
      </p>
    </section>
  );
}
