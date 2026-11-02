export default function Hero() {
  return (
    <section
      className="hero page-width"
      id="inicio"
      aria-labelledby="titulo-principal"
    >
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="small-dot" aria-hidden="true"></span> A small
          molecular notebook
        </p>
        <h1 id="titulo-principal">
          RNA also has an <em>architecture.</em>
        </h1>
        <p className="hero-text">
          A strand folds, finds its shape, and gets to work. Looking closely
          helps us understand how life works at a scale we cannot see.
        </p>
        <a className="button" href="#explorar">
          Open the molecular notebook <span aria-hidden="true">↗</span>
        </a>
        <p className="hero-note">
          Structure, four bases, and three protagonists.
        </p>
      </div>
      <figure className="hero-figure">
        <div className="figure-heading">
          <span>FIG. 01</span>
          <span>tRNA · PDB 1EHZ</span>
        </div>
        <img
          src="/assets/images/trna-molecule.svg"
          width="720"
          height="720"
          fetchPriority="high"
          alt="Atomic model of yeast phenylalanine tRNA, folded into an L shape. Its anticodon appears in orange."
        />
        <div className="figure-label">
          <span className="label-line" aria-hidden="true"></span> One strand,
          many folds.
        </div>
        <figcaption>
          <span>Phenylalanine tRNA · Yeast</span>
          <a href="https://www.rcsb.org/structure/1EHZ">
            View the record <span aria-hidden="true">↗</span>
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
