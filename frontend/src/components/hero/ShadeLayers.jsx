/**
 * ShadeLayers — 3 shade overlays on top of the hero video:
 * 1. Horizontal gradient (alphas .683 to .054)
 * 2. Vertical gradient (alphas .060 to .632)
 * 3. Bottom-left radial ellipse (93.8% × 41.3%, alpha 1 to 0)
 */
export function ShadeLayers() {
  return (
    <>
      <div className="pg-shade pg-shade--horiz" aria-hidden="true" />
      <div className="pg-shade pg-shade--vert" aria-hidden="true" />
      <div className="pg-shade pg-shade--radial" aria-hidden="true" />
    </>
  );
}
