import { useRef, useState } from "react";

export default function ObservationList({ observations, onRemove, onRestore }) {
  const [filter, setFilter] = useState("all");
  const [newestFirst, setNewestFirst] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const heading = useRef(null);
  const filtered = observations.filter(
    (observation) => filter === "all" || observation.highlighted,
  );
  const visible = newestFirst ? [...filtered].reverse() : filtered;

  function removeNote(id) {
    onRemove(id);
    setAnnouncement("Observation removed.");
    heading.current.focus();
  }

  function restoreView(observation) {
    onRestore(observation);
    setAnnouncement(`View restored to ${observation.rotation} degrees.`);
  }

  return (
    <div className="saved-notes">
      <p className="eyebrow">The notebook</p>
      <h3 ref={heading} tabIndex={-1}>
        Saved observations{" "}
        <span className="note-total">{observations.length}</span>
      </h3>
      <p className="session-note">
        Saved in this session. Reloading the page clears your notes.
      </p>
      {observations.length > 0 && (
        <div className="note-toolbar">
          <label htmlFor="note-filter">
            Show
            <select
              id="note-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All observations</option>
              <option value="highlighted">Anticodon highlighted</option>
            </select>
          </label>
          <button type="button" onClick={() => setNewestFirst(!newestFirst)}>
            {newestFirst ? "Newest first" : "Oldest first"}{" "}
            <span aria-hidden="true">↕</span>
          </button>
        </div>
      )}
      {visible.length === 0 ? (
        <p className="empty-notes">
          {observations.length === 0
            ? "Nothing saved yet. Rotate the molecule and write your first observation."
            : "No saved observations have the anticodon highlighted. Choose All observations to see the rest."}
        </p>
      ) : (
        <ul className="observation-list">
          {visible.map((observation) => (
            <li key={observation.id}>
              <p className="saved-view">
                {observation.rotation}° ·{" "}
                {observation.highlighted
                  ? "anticodon highlighted"
                  : "whole strand"}
              </p>
              <p className="saved-text">{observation.text}</p>
              <div className="note-actions">
                <button type="button" onClick={() => restoreView(observation)}>
                  Restore view
                </button>
                <button
                  type="button"
                  onClick={() => removeNote(observation.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="form-feedback" role="status">
        {announcement}
      </p>
    </div>
  );
}
