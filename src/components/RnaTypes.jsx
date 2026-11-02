import { useRef, useState } from "react";
import { rnaTypes } from "../data/rnaTypes";
import RnaTypePanel from "./RnaTypePanel";

export default function RnaTypes() {
  const [activeType, setActiveType] = useState("mrna");
  const tabRefs = useRef({});

  function handleTabKey(event, id) {
    const index = rnaTypes.findIndex((type) => type.id === id);
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % rnaTypes.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + rnaTypes.length) % rnaTypes.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = rnaTypes.length - 1;
    else return;
    event.preventDefault();
    const nextId = rnaTypes[nextIndex].id;
    setActiveType(nextId);
    tabRefs.current[nextId].focus();
  }

  return (
    <section
      className="section page-width"
      id="tipos"
      aria-labelledby="tipos-titulo"
    >
      <div className="section-heading">
        <p className="eyebrow">03 / Teamwork</p>
        <h2 id="tipos-titulo">Three ways to take part.</h2>
        <p>
          Making a protein takes a message, an adapter, and a meeting place.
          These three types of RNA play those roles.
        </p>
      </div>
      <div className="type-tabs" role="tablist" aria-label="Types of RNA">
        {rnaTypes.map((type) => (
          <button
            key={type.id}
            ref={(element) => {
              tabRefs.current[type.id] = element;
            }}
            className="type-button"
            id={`tab-${type.id}`}
            type="button"
            role="tab"
            aria-selected={activeType === type.id}
            aria-controls={`panel-${type.id}`}
            tabIndex={activeType === type.id ? 0 : -1}
            onClick={() => setActiveType(type.id)}
            onKeyDown={(event) => handleTabKey(event, type.id)}
          >
            {type.shortName}
            <small>{type.role}</small>
          </button>
        ))}
      </div>
      {rnaTypes.map((type) => (
        <RnaTypePanel
          key={type.id}
          type={type}
          active={activeType === type.id}
        />
      ))}
      <p className="margin-note">
        And they are not the only ones: other RNAs help regulate gene
        expression.
      </p>
    </section>
  );
}
