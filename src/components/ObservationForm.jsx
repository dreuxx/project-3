import { useRef, useState } from "react";

export default function ObservationForm({ rotation, highlighted, onSave }) {
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);
  const noteInput = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const text = note.trim();
    if (!text) {
      setHasError(true);
      setFeedback("Write a short observation before saving.");
      noteInput.current.focus();
      return;
    }
    onSave(text);
    setNote("");
    setHasError(false);
    setFeedback("Observation saved with the current view.");
    noteInput.current.focus();
  }

  return (
    <form className="note-form" onSubmit={handleSubmit} noValidate>
      <p className="eyebrow">Your field notes</p>
      <h3>Keep a closer look.</h3>
      <p className="note-intro">
        Write what you notice. Save the note with this angle and highlight
        setting.
      </p>
      <label htmlFor="observation-text">Observation</label>
      <textarea
        ref={noteInput}
        id="observation-text"
        rows="4"
        maxLength={240}
        required
        value={note}
        aria-invalid={hasError}
        aria-describedby="note-count note-feedback"
        onChange={(event) => {
          setNote(event.target.value);
          setFeedback("");
          setHasError(false);
        }}
      />
      <div className="note-details">
        <p className="view-summary">
          View: {rotation}° ·{" "}
          {highlighted ? "anticodon highlighted" : "whole strand"}
        </p>
        <span id="note-count">{note.length}/240</span>
      </div>
      <button className="button" type="submit">
        Save observation <span aria-hidden="true">+</span>
      </button>
      <p
        id="note-feedback"
        className={`form-feedback${hasError ? " is-error" : ""}`}
        role="status"
      >
        {feedback}
      </p>
    </form>
  );
}
