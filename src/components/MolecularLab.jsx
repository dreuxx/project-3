import { useState } from "react";
import MoleculeViewer from "./MoleculeViewer";
import ViewerControls from "./ViewerControls";
import ModelNotes from "./ModelNotes";

import ObservationForm from "./ObservationForm";
import ObservationList from "./ObservationList";

export default function MolecularLab() {
  const [rotation, setRotation] = useState(0);
  const [highlighted, setHighlighted] = useState(false);

  const [observations, setObservations] = useState([]);

  function saveObservation(text) {
    const observation = {
      id: crypto.randomUUID(),
      text,
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
      <div className="notebook-grid">
        <ObservationForm
          rotation={rotation}
          highlighted={highlighted}
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
