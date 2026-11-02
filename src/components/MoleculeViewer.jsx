import { projectStructure } from "../utils/projectStructure";

export default function MoleculeViewer({
  points,
  structureId,
  chainId,
  rotation,
  highlighted,
  children,
}) {
  const shapes = projectStructure(points, rotation);
  const pointRadius = points.length > 300 ? 1.8 : points.length > 100 ? 3 : 5;
  const lineWidth = points.length > 300 ? 1.8 : points.length > 100 ? 4 : 7;

  return (
    <figure className="molecule-viewer">
      <div className="viewer-topline">
        <span>
          <span className="small-dot" aria-hidden="true" />
          RNA chain {chainId}
        </span>
        <span>{structureId} / RNA</span>
      </div>
      <svg
        id="rna-model"
        viewBox="0 0 640 500"
        role="img"
        aria-labelledby="model-title model-desc"
      >
        <title id="model-title">Simplified RNA structure {structureId}</title>
        <desc id="model-desc">
          {points.length} points follow RNA chain {chainId}. View rotated{" "}
          {rotation} degrees.
          {highlighted &&
            " Anticodon highlighted in orange: positions 34, 35, and 36."}
        </desc>
        <g>
          {shapes.map((shape) => {
            if (shape.kind === "line") {
              return (
                <line
                  key={shape.id}
                  x1={shape.x1}
                  y1={shape.y1}
                  x2={shape.x2}
                  y2={shape.y2}
                  stroke="#a8bd82"
                  strokeWidth={lineWidth}
                  strokeLinecap="round"
                />
              );
            }
            const isAnticodon =
              highlighted && shape.residue >= 34 && shape.residue <= 36;
            return (
              <circle
                key={shape.id}
                cx={shape.x}
                cy={shape.y}
                r={isAnticodon ? pointRadius + 3 : pointRadius}
                fill={isAnticodon ? "#eda77c" : "#dce7b8"}
                stroke="#273e32"
                strokeWidth="1.5"
                data-residue={shape.residue}
              />
            );
          })}
        </g>
      </svg>
      <div className="viewer-legend">
        <span>
          <i className="legend-dot chain-dot" aria-hidden="true" />
          RNA strand
        </span>
        <span>
          <i className="legend-dot anticodon-dot" aria-hidden="true" />
          Anticodon when highlighted
        </span>
      </div>
      {children}
      <figcaption>
        Each point represents a C4′ carbon. Lines connect consecutive
        nucleotides; gaps are not bridged. This is the first deposited model and
        the selected RNA chain, simplified to its resolved backbone.
      </figcaption>
    </figure>
  );
}
