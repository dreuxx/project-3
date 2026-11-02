export default function RnaTypePanel({ type, active }) {
  return (
    <article
      className="type-panel"
      id={`panel-${type.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${type.id}`}
      hidden={!active}
      tabIndex={0}
    >
      <div className="type-copy">
        <p className="eyebrow">{type.name}</p>
        <h3>{type.title}</h3>
        <p>{type.text}</p>
        <p className="type-takeaway">
          <span>Remember it this way</span>
          {type.takeaway}
        </p>
      </div>
      <figure className="type-figure">
        <img
          src={`/assets/images/${type.id}.svg`}
          width="500"
          height="280"
          loading="lazy"
          alt={type.alt}
        />
        <figcaption>{type.caption}</figcaption>
      </figure>
    </article>
  );
}
