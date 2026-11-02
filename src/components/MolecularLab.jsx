import useRnaModel from "../hooks/useRnaModel";
import { useState } from "react";
import MoleculeViewer from "./MoleculeViewer";
import ViewerControls from "./ViewerControls";
import ModelNotes from "./ModelNotes";

import ObservationForm from "./ObservationForm";
import ObservationList from "./ObservationList";

export default function MolecularLab({ selectedStructure, onSelectStructure }) {
  const structureId = selectedStructure?.id ?? "1EHZ";
  const { data: model, loading, error, retry } = useRnaModel(structureId);
  const [selectedChain, setSelectedChain] = useState(null);
  const chain =
    model?.chains.find(
      (item) =>
        item.id ===
        (selectedChain?.structureId === structureId
          ? selectedChain.chainId
          : null),
    ) ?? model?.chains[0];
  const canHighlight =
    ["1EHZ", "1TRA"].includes(structureId) && chain?.authorId === "A";
  const [rotation, setRotation] = useState(0);
  const [highlighted, setHighlighted] = useState(false);

  const [observations, setObservations] = useState([]);

  function saveObservation(text) {
    if (loading || error || !chain) return false;
    const observation = {
      id: crypto.randomUUID(),
      text,
      linkedStructure: model.entry,
      chainId: chain.id,
      rotation,
      highlighted: canHighlight && highlighted,
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
    setSelectedChain({
      structureId: observation.linkedStructure?.id ?? "1EHZ",
      chainId: observation.chainId ?? "A",
    });
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
        <h2 id="explorar-titulo" tabIndex={-1}>
          From strand to fold.
        </h2>
        <p>
          Rotate the selected RNA structure, choose a resolved chain, and
          compare its fold. Anticodon highlighting is available for the
          annotated tRNA examples.
        </p>
      </div>
      {loading ? (
        <p className="api-message" role="status">
          Loading coordinates for {structureId}…
        </p>
      ) : error ? (
        <div className="api-message api-error" role="alert">
          <h3>Could not load {structureId}.</h3>
          <p>{error}</p>
          <button type="button" onClick={retry}>
            Retry coordinates
          </button>
        </div>
      ) : (
        model &&
        chain && (
          <>
            <label className="chain-picker" htmlFor="rna-chain">
              RNA chain
              <select
                id="rna-chain"
                value={chain.id}
                onChange={(event) =>
                  setSelectedChain({ structureId, chainId: event.target.value })
                }
              >
                {model.chains.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} (author {item.authorId}) · {item.points.length}{" "}
                    points
                  </option>
                ))}
              </select>
            </label>
            <div className="explorer-grid">
              <MoleculeViewer
                points={chain.points}
                structureId={structureId}
                chainId={chain.id}
                rotation={rotation}
                highlighted={canHighlight && highlighted}
              >
                <ViewerControls
                  canHighlight={canHighlight}
                  rotation={rotation}
                  highlighted={highlighted}
                  onRotationChange={setRotation}
                  onHighlightChange={setHighlighted}
                  onRotateStep={rotateStep}
                  onReset={resetView}
                />
              </MoleculeViewer>
              <ModelNotes
                model={model}
                chain={chain}
                canHighlight={canHighlight}
                rotation={rotation}
                highlighted={highlighted}
              />
            </div>
          </>
        )
      )}
      <div className="linked-context">
        <p>
          <strong>3D viewer: {structureId}.</strong> The selected record loads
          its own RNA coordinates.
        </p>
        <p role="status">
          {selectedStructure
            ? `Linked archive record: ${selectedStructure.id} — ${selectedStructure.title}`
            : "Choose an archive record below to link it to your next observation."}
        </p>
        <a href="#biblioteca">Choose an archive record ↓</a>
        {selectedStructure && (
          <button type="button" onClick={() => onSelectStructure(null)}>
            Return to 1EHZ
          </button>
        )}
      </div>
      <div className="notebook-grid">
        <ObservationForm
          rotation={rotation}
          highlighted={canHighlight && highlighted}
          viewerId={structureId}
          disabled={loading || !!error}
          selectedStructure={model?.entry ?? selectedStructure}
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
