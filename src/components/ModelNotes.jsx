export default function ModelNotes({ rotation, highlighted }) {
  return (
    <div className="explorer-notes">
      <span className="note-kicker">The piece we are looking at</span>
      <h3>A tiny adapter.</h3>
      <p>
        This tRNA helps add phenylalanine to a protein. One end carries the
        amino acid; the other recognizes a codon in messenger RNA.
      </p>
      <dl className="spec-list">
        <div>
          <dt>Length</dt>
          <dd>
            76 <span>nucleotides</span>
          </dd>
        </div>
        <div>
          <dt>Organism</dt>
          <dd>
            <i lang="la">S. cerevisiae</i>
          </dd>
        </div>
        <div>
          <dt>Experimental resolution</dt>
          <dd>
            1.93 <span>Å</span>
          </dd>
        </div>
        <div>
          <dt>Current view</dt>
          <dd>{rotation}°</dd>
        </div>
      </dl>
      <div className="observation">
        <p className="eyebrow">Notice this</p>
        <p role="status">
          {highlighted
            ? "The three orange points are positions 34, 35, and 36: the anticodon that recognizes the mRNA codon."
            : "The anticodon occupies just three positions on the strand: 34, 35, and 36. Highlight it to find it."}
        </p>
      </div>
      <a className="text-link" href="/assets/data/1EHZ.pdb" download>
        Download the original coordinates <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}
