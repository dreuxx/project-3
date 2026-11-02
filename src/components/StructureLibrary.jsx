import useRnaStructures from "../hooks/useRnaStructures";
import StructureCard from "./StructureCard";

export default function StructureLibrary() {
  const { data, loading, error, retry } = useRnaStructures();
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
          <div className="structure-grid">
            {data.map((structure) => (
              <StructureCard key={structure.id} structure={structure} />
            ))}
          </div>
        )}
      </div>
      <p className="margin-note">
        Source: RCSB PDB Data API · A curated collection, not the complete
        archive.
      </p>
    </section>
  );
}
