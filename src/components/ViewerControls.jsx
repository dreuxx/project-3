export default function ViewerControls({
  rotation,
  highlighted,
  onRotationChange,
  onHighlightChange,
  onRotateStep,
  onReset,
}) {
  return (
    <div className="viewer-controls">
      <div className="rotation-control">
        <label htmlFor="rotation">Rotate the view</label>
        <input
          type="range"
          id="rotation"
          min="-180"
          max="180"
          step="1"
          value={rotation}
          aria-valuetext={`${rotation} degrees`}
          onChange={(event) => onRotationChange(Number(event.target.value))}
        />
        <output htmlFor="rotation">{rotation}°</output>
      </div>
      <div className="viewer-actions">
        <button type="button" onClick={onRotateStep}>
          Rotate 30° <span aria-hidden="true">↻</span>
        </button>
        <button
          type="button"
          aria-pressed={highlighted}
          onClick={() => onHighlightChange(!highlighted)}
        >
          {highlighted ? "Hide anticodon highlight" : "Highlight anticodon"}
        </button>
        <button type="button" onClick={onReset}>
          Reset view
        </button>
      </div>
    </div>
  );
}
