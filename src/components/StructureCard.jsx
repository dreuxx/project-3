export default function StructureCard({ structure }) {
  return (
    <article className="structure-card">
      <p className="eyebrow">PDB {structure.id}</p>
      <h3>{structure.title}</h3>
      <dl>
        <div>
          <dt>Method</dt>
          <dd>{structure.method}</dd>
        </div>
        <div>
          <dt>Resolution</dt>
          <dd>
            {structure.resolution == null
              ? "Not reported"
              : `${structure.resolution} Å`}
          </dd>
        </div>
        <div>
          <dt>Released</dt>
          <dd>{structure.released}</dd>
        </div>
      </dl>
      <a href={`https://www.rcsb.org/structure/${structure.id}`}>
        Open {structure.id} at RCSB <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
