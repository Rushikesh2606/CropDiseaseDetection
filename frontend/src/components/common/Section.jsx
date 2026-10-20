/**
 * Section — Shared wrapper for Stage C segregated sections.
 * Numbered eyebrow label, h2, intro, 1px hairline divider,
 * max-width ~72rem (max-w-6xl), alternating surface,
 * and scroll-reveal animation (IntersectionObserver + WAAPI, 12px lift + fade, 500ms).
 */
import { useEffect, useRef } from 'react';

export function Section({
  id,
  eyebrow,
  title,
  intro,
  surface = 'plain', // 'plain' (#03080B) or 'glass' (subtle glass panel)
  children,
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.animate(
              [
                { opacity: 0, transform: 'translateY(12px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: 500,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                fill: 'forwards',
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-labelledby={headingId}
      className={`relative z-10 py-20 px-6 sm:px-10 border-t border-white/5 scroll-mt-20 ${
        surface === 'glass' ? 'bg-[rgba(3,8,11,0.65)] backdrop-blur-md' : 'bg-[#03080B]'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          {eyebrow && (
            <p className="text-xs uppercase font-semibold tracking-widest text-[#88DECC]">
              {eyebrow}
            </p>
          )}
          <h2
            id={headingId}
            className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#F5FAF6] tracking-tight"
          >
            {title}
          </h2>
          {intro && (
            <p className="text-base text-[#ECF1EF]/70 leading-relaxed">
              {intro}
            </p>
          )}
        </div>

        {/* Section Content */}
        <div>{children}</div>
      </div>
    </section>
  );
}
