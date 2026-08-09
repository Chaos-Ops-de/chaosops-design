import React from 'react';
import './FlipchartBackground.css';

export interface FlipchartBackgroundProps {
  /** Show the three notebook-style holes along the top edge. Default true. */
  holes?: boolean;
  /** Diameter of each hole, in px. Default 24. */
  holeSize?: number;
  /** Distance from the top edge to each hole, in px. Default 6. */
  holeTop?: number;
  /** Horizontal inset of the left/right holes from the edge (any CSS length). Default '15vw'. */
  holeInset?: string;
  /** Show the torn-paper strip along the top edge. Default true. */
  tornEdge?: boolean;
  /** Height of the torn-paper strip, in px. Default 24. */
  tornEdgeHeight?: number;
  /** Show the playful star/circle/squiggle doodles. Default true. */
  doodles?: boolean;
}

/**
 * Decorative "flipchart paper" accents — notebook holes, a torn top edge,
 * and playful doodles. Renders as absolutely-positioned overlays, so the
 * parent must be a positioned (or otherwise stacking-relevant) container
 * that already carries the ruled-paper background.
 */
export const FlipchartBackground: React.FC<FlipchartBackgroundProps> = ({
  holes = true,
  holeSize = 24,
  holeTop = 6,
  holeInset = '15vw',
  tornEdge = true,
  tornEdgeHeight = 24,
  doodles = true,
}) => {
  const holeStyle: React.CSSProperties = { width: holeSize, height: holeSize, top: holeTop };

  return (
    <>
      {holes && (
        <>
          <div
            className="chaos-flipchart-hole"
            style={{ ...holeStyle, left: holeInset }}
            aria-hidden="true"
          />
          <div
            className="chaos-flipchart-hole chaos-flipchart-hole-center"
            style={holeStyle}
            aria-hidden="true"
          />
          <div
            className="chaos-flipchart-hole"
            style={{ ...holeStyle, right: holeInset }}
            aria-hidden="true"
          />
        </>
      )}
      {tornEdge && (
        <div
          className="chaos-flipchart-torn-edge"
          style={{ height: tornEdgeHeight }}
          aria-hidden="true"
        />
      )}
      {doodles && (
        <>
          <div className="chaos-flipchart-doodle-star" aria-hidden="true" />
          <div className="chaos-flipchart-doodle-circle" aria-hidden="true" />
          <div className="chaos-flipchart-doodle-squiggle" aria-hidden="true" />
        </>
      )}
    </>
  );
};
