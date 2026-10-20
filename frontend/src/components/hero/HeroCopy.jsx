/**
 * HeroCopy — Brand "PlantGuard AI" in RV Brand teal,
 * 3-line headline with individual line clip masks,
 * and 2-line lede.
 */
export function HeroCopy({ isHidden = false }) {
  return (
    <>
      {/* Brand [OVERRIDE: "PlantGuard AI", SPEC: RV Brand font, teal] */}
      <span
        className={`pg-brand ${isHidden ? 'pg-entrance-hidden' : ''}`}
        id="pg-hero-brand"
        aria-hidden="true"
        style={{ fontSize: 'calc(var(--u) * 20)', padding: 0 }}
      >
        PlantGuard AI
      </span>

      {/* Headline [SPEC: 3 lines, light weight, nowrap, per-line clip mask; OVERRIDE lines] */}
      <h1 className="pg-title" aria-label="A Healthier Harvest Starts with a Leaf">
        <span className="pg-title__line">
          <span
            className={`pg-title__line--inner ${isHidden ? 'pg-entrance-hidden' : ''}`}
            id="pg-title-1"
          >
            A Healthier Harvest
          </span>
        </span>
        <span className="pg-title__line">
          <span
            className={`pg-title__line--inner ${isHidden ? 'pg-entrance-hidden' : ''}`}
            id="pg-title-2"
          >
            Starts with
          </span>
        </span>
        <span className="pg-title__line">
          <span
            className={`pg-title__line--inner ${isHidden ? 'pg-entrance-hidden' : ''}`}
            id="pg-title-3"
          >
            a Leaf
          </span>
        </span>
      </h1>

      {/* Lede [SPEC: 2 lines; OVERRIDE: PlantGuard lede] */}
      <p className={`pg-lede ${isHidden ? 'pg-entrance-hidden' : ''}`} id="pg-lede">
        <span className="pg-lede__line">
          AI-powered diagnosis across 15 crop leaf conditions
        </span>
        <span className="pg-lede__line">
          Upload a leaf and get a calibrated result in seconds
        </span>
      </p>
    </>
  );
}
