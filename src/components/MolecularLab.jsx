import { useState } from "react";
import MoleculeViewer from "./MoleculeViewer";
import ViewerControls from "./ViewerControls";
import ModelNotes from "./ModelNotes";

import ObservationForm from "./ObservationForm";
import ObservationList from "./ObservationList";

export default function MolecularLab({ selectedStructure, onSelectStructure }) {
  const [rotation, setRotation] = useState(0);
  const [highlighted, setHighlighted] = useState(false);

  const [observations, setObservations] = useState([]);

  function saveObservation(text) {
    const observation = {
      id: crypto.randomUUID(),
      text,
      linkedStructure: selectedStructure,
      rotation,
      highlighted,
    };
    setObservations((current) => [...current, observation]);
  }

  function removeObservation(id) {
    setObservations((current) =>
      current.filter((observation) => observation.id !== id),
    );
  }

  function restoreObservation(observation) {
    onSelectStructure(observation.linkedStructure ?? null);
    setRotation(observation.rotation);
    setHighlighted(observation.highlighted);
  }

  function rotateStep() {
    setRotation((current) =>
      current + 30 > 180 ? current - 330 : current + 30,
    );
  }

  function resetView() {
    setRotation(0);
    setHighlighted(false);
  }

  return (
    <section
      className="section page-width"
      id="explorar"
      aria-labelledby="explorar-titulo"
    >
      <div className="section-heading">
        <p className="eyebrow">01 / Look closer</p>
        <h2 id="explorar-titulo">From strand to fold.</h2>
        <p>
          Turn the tRNA, find its anticodon, and look at how one strand folds
          into an L shape.
        </p>
      </div>
      <div className="explorer-grid">
        <MoleculeViewer rotation={rotation} highlighted={highlighted}>
          <ViewerControls
            rotation={rotation}
            highlighted={highlighted}
            onRotationChange={setRotation}
            onHighlightChange={setHighlighted}
            onRotateStep={rotateStep}
            onReset={resetView}
          />
        </MoleculeViewer>
        <ModelNotes rotation={rotation} highlighted={highlighted} />
      </div>
      <div className="linked-context">
        <p>
          <strong>3D viewer: 1EHZ.</strong> The angle and anticodon controls
          always refer to this tRNA model.
        </p>
        <p role="status">
          {selectedStructure
            ? `Linked archive record: ${selectedStructure.id} — ${selectedStructure.title}`
            : "Choose an archive record below to link it to your next observation."}
        </p>
        <a href="#biblioteca">Choose an archive record ↓</a>
        {selectedStructure && (
          <button type="button" onClick={() => onSelectStructure(null)}>
            Clear linked record
          </button>
        )}
      </div>
      <div className="notebook-grid">
        <ObservationForm
          rotation={rotation}
          highlighted={highlighted}
          selectedStructure={selectedStructure}
          onSave={saveObservation}
        />
        <ObservationList
          observations={observations}
          onRemove={removeObservation}
          onRestore={restoreObservation}
        />
      </div>
    </section>
  );
}
