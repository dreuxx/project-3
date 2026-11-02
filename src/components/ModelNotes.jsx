export default function ModelNotes({
  model,
  chain,
  rotation,
  highlighted,
  canHighlight,
}) {
  return (
    <div className="explorer-notes">
      <span className="note-kicker">The structure currently displayed</span>
      <h3>PDB {model.entry.id}</h3>
      <p>{model.entry.title}</p>
      <dl className="spec-list">
        <div>
          <dt>Displayed RNA chain</dt>
          <dd>
            {chain.id} <span>(author: {chain.authorId})</span>
          </dd>
        </div>
        <div>
          <dt>Resolved C4′ points</dt>
          <dd>{chain.points.length}</dd>
        </div>
        <div>
          <dt>Experimental resolution</dt>
          <dd>
            {model.entry.resolution == null
              ? "Not reported"
              : `${model.entry.resolution} Å`}
          </dd>
        </div>
        <div>
          <dt>Method</dt>
          <dd>{model.entry.method}</dd>
        </div>
        <div>
          <dt>Current view</dt>
          <dd>{rotation}°</dd>
        </div>
      </dl>
      <div className="observation">
        <p className="eyebrow">Notice this</p>
        <p role="status">
          {canHighlight
            ? highlighted
              ? "The anticodon residues 34–36 are highlighted in orange."
              : "Highlight the known anticodon at author residue numbers 34–36."
            : "Anticodon positions are not annotated for this chain. The viewer shows its resolved RNA backbone."}
        </p>
      </div>
      <a
        className="text-link"
        href={`https://files.rcsb.org/download/${model.entry.id}.cif`}
      >
        Download these coordinates ↓
      </a>
    </div>
  );
}
