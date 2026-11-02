export default function Sources() {
  return (
    <section
      className="sources-section page-width"
      id="fuentes"
      aria-labelledby="fuentes-titulo"
    >
      <div>
        <p className="eyebrow">For further reading</p>
        <h2 id="fuentes-titulo">Back to the source.</h2>
        <p>
          The molecular illustration and explorer use coordinates from the same
          experimental record.
        </p>
      </div>
      <ol className="source-list">
        <li>
          <a href="https://www.rcsb.org/structure/1EHZ">
            <span>
              <strong>The structure · PDB 1EHZ</strong>
              <small>Shi and Moore, 2000 · RCSB Protein Data Bank</small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </li>
        <li>
          <a href="https://www.genome.gov/genetics-glossary/RNA-Ribonucleic-Acid">
            <span>
              <strong>What is RNA?</strong>
              <small>National Human Genome Research Institute</small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </li>
        <li>
          <a href="https://www.ncbi.nlm.nih.gov/books/NBK26829/">
            <span>
              <strong>From RNA to protein</strong>
              <small>Molecular Biology of the Cell · NCBI Bookshelf</small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ol>
    </section>
  );
}
