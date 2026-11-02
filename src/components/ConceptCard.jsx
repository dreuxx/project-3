export default function ConceptCard({ concept }) {
  return (
    <article className="concept">
      <span className="concept-number">{concept.id}</span>
      <img
        src={`/assets/images/${concept.image}`}
        width="320"
        height="130"
        alt={concept.alt}
        loading="lazy"
      />
      <h3>{concept.title}</h3>
      <p>{concept.text}</p>
    </article>
  );
}
