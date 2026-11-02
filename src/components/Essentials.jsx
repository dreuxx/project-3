import ConceptCard from "./ConceptCard";
import { concepts } from "../data/content";

export default function Essentials() {
  return (
    <section
      className="concept-section"
      id="conceptos"
      aria-labelledby="conceptos-titulo"
    >
      <div className="page-width section">
        <div className="section-heading heading-split">
          <div>
            <p className="eyebrow">02 / The essentials</p>
            <h2 id="conceptos-titulo">
              Before we go on,
              <br />
              three ideas.
            </h2>
          </div>
          <p>
            RNA stands for ribonucleic acid. These are the building blocks of
            the vocabulary.
          </p>
        </div>
        <div className="concept-grid">
          {concepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </div>
    </section>
  );
}
