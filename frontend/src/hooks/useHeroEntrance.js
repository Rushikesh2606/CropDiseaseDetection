/**
 * useHeroEntrance — Spec-exact Web Animations API entrance timeline.
 * Ported 1:1 from Stage A hero reference script.
 * StrictMode-safe and idempotent with cleanup.
 * Guarantees zero inline styles remain on elements after completion.
 */
import { useEffect, useRef } from 'react';
import { EASINGS, TIMELINE } from '../components/hero/heroSpec';

export function useHeroEntrance({ stageRef, videoRef, isHome = true }) {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!isHome || hasRunRef.current) return;
    const stage = stageRef?.current;
    if (!stage) return;

    hasRunRef.current = true;
    const anims = [];

    const logo = stage.querySelector('#pg-logo');
    const nav = stage.querySelector('#pg-nav');
    const menuBtn = stage.querySelector('#pg-menu-btn');
    const soundBtn = stage.querySelector('#pg-sound-btn');
    const brand = stage.querySelector('#pg-hero-brand');
    const title1 = stage.querySelector('#pg-title-1');
    const title2 = stage.querySelector('#pg-title-2');
    const title3 = stage.querySelector('#pg-title-3');
    const lede = stage.querySelector('#pg-lede');
    const actions = stage.querySelector('#pg-actions');
    const scrollCue = stage.querySelector('#pg-scroll-cue');

    const treePaths = logo ? Array.from(logo.querySelectorAll('path')) : [];
    const hiddenEls = [
      logo,
      nav,
      soundBtn,
      menuBtn,
      brand,
      title1,
      title2,
      title3,
      lede,
      actions,
      scrollCue,
    ].filter(Boolean);

    function showFinished() {
      hiddenEls.forEach((el) => {
        el.classList.remove('pg-entrance-hidden');
        el.style.opacity = '';
        el.style.transform = '';
      });
      treePaths.forEach((p) => {
        p.style.strokeDasharray = '';
        p.style.strokeDashoffset = '';
      });
      if (logo) void logo.offsetHeight;
      if (actions) void actions.offsetHeight;
    }

    // Reduced motion check [SPEC: show finished page immediately]
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      showFinished();
      return;
    }

    // Apply initial hidden states
    hiddenEls.forEach((el) => el.classList.add('pg-entrance-hidden'));
    treePaths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 40;
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    // Failsafe [SPEC: 3.5s]
    const failsafe = setTimeout(() => {
      showFinished();
    }, TIMELINE.failsafeMs);

    let fontsReady = false;
    let videoReady = false;

    function tryStart() {
      if (fontsReady && videoReady) {
        clearTimeout(failsafe);
        runEntrance();
      }
    }

    // Fonts ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          fontsReady = true;
          tryStart();
        })
        .catch(() => {
          fontsReady = true;
          tryStart();
        });
    } else {
      fontsReady = true;
    }

    // Video ready
    const video = videoRef?.current || stage.querySelector('#pg-video');
    if (video) {
      if (video.readyState >= 2) {
        videoReady = true;
        tryStart();
      } else {
        const handleLoadedData = () => {
          video.removeEventListener('loadeddata', handleLoadedData);
          videoReady = true;
          tryStart();
        };
        video.addEventListener('loadeddata', handleLoadedData);
      }
    } else {
      videoReady = true;
    }

    function runEntrance() {
      const ctaEl = stage.querySelector('.pg-cta-pill');
      const ctaH = ctaEl ? ctaEl.offsetHeight : 46;
      const isMobile = window.innerWidth < 650;
      const scaleF = (ctaH / 46) * (isMobile ? 0.8 : 1);
      const travel = (n) => `${Math.round(n * scaleF)}px`;

      function anim(el, keyframes, options) {
        if (!el) return null;
        const a = el.animate(keyframes, options);
        anims.push(a);
        a.finished
          .then(() => {
            el.classList.remove('pg-entrance-hidden');
            el.style.opacity = '';
            el.style.transform = '';
          })
          .catch(() => {});
        return a;
      }

      // Logo [SPEC: 0ms, 500ms, quart]
      anim(
        logo,
        [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 1 },
        ],
        { duration: 500, delay: 0, easing: EASINGS.quart, fill: 'backwards' }
      );

      // Tree strokes [SPEC: 80ms + 45ms per path, 820ms, grow ease]
      treePaths.forEach((p, i) => {
        const delay = TIMELINE.treePathStart + i * TIMELINE.treePathStep;
        const len = p.getTotalLength ? p.getTotalLength() : 40;
        const a = p.animate(
          [
            { strokeDashoffset: len },
            { strokeDashoffset: 0 },
          ],
          {
            duration: TIMELINE.treePathDuration,
            delay,
            easing: EASINGS.grow,
            fill: 'backwards',
          }
        );
        anims.push(a);
        a.finished
          .then(() => {
            p.style.strokeDasharray = '';
            p.style.strokeDashoffset = '';
          })
          .catch(() => {});
      });

      // Moth [SPEC: 420ms, 650ms, expo, scale from 0.92]
      const moth = logo?.querySelector('.pg-logo-moth');
      if (moth) {
        anim(
          moth,
          [
            { opacity: 0, transform: 'scale(0.92)', offset: 0 },
            { opacity: 1, transform: 'scale(1)', offset: 1 },
          ],
          { duration: 650, delay: 420, easing: EASINGS.expo, fill: 'backwards' }
        );
      }

      // Nav / Menu button [SPEC: 120ms, 700ms, expo, lift 8px]
      const navEl = isMobile ? menuBtn : nav;
      anim(
        navEl,
        [
          { opacity: 0, transform: `translateY(${travel(8)})`, offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 1 },
        ],
        { duration: 700, delay: 120, easing: EASINGS.expo, fill: 'backwards' }
      );

      // Nav links ripple [SPEC: 260ms, 45ms apart, lift 4px]
      if (!isMobile && nav) {
        const links = nav.querySelectorAll('.pg-nav-link');
        links.forEach((link, i) => {
          anim(
            link,
            [
              { opacity: 0, transform: `translateY(${travel(4)})`, offset: 0 },
              { opacity: 1, transform: 'translateY(0)', offset: 1 },
            ],
            {
              duration: 500,
              delay: 260 + i * 45,
              easing: EASINGS.expo,
              fill: 'backwards',
            }
          );
        });
      }

      // Sound button [SPEC: 200ms, lift 8px]
      anim(
        soundBtn,
        [
          { opacity: 0, transform: `translateY(${travel(8)})`, offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 1 },
        ],
        { duration: 700, delay: 200, easing: EASINGS.expo, fill: 'backwards' }
      );

      // Brand [SPEC: 300ms, 10px, 650ms]
      anim(
        brand,
        [
          { opacity: 0, transform: `translateY(${travel(10)})`, offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 1 },
        ],
        { duration: 650, delay: 300, easing: EASINGS.expo, fill: 'backwards' }
      );

      // Title lines [SPEC: 380ms, +90ms per line, 1050ms, translateY(115%) inside clip mask]
      [[title1, 380], [title2, 470], [title3, 560]].forEach(([el, delay]) => {
        anim(
          el,
          [
            { transform: 'translateY(115%)', offset: 0 },
            { transform: 'translateY(0)', offset: 1 },
          ],
          {
            duration: 1050,
            delay,
            easing: EASINGS.expo,
            fill: 'backwards',
          }
        );
      });

      // Lede [SPEC: 800ms and 860ms, 14px, 800ms]
      const ledeLines = lede ? lede.querySelectorAll('.pg-lede__line') : [];
      ledeLines.forEach((line, i) => {
        anim(
          line,
          [
            { opacity: 0, transform: `translateY(${travel(14)})`, offset: 0 },
            { opacity: 1, transform: 'translateY(0)', offset: 1 },
          ],
          {
            duration: 800,
            delay: 800 + i * 60,
            easing: EASINGS.expo,
            fill: 'backwards',
          }
        );
      });
      if (lede) {
        lede.classList.remove('pg-entrance-hidden');
      }

      // CTA [SPEC: 1000ms, 12px, 800ms]
      anim(
        actions,
        [
          { opacity: 0, transform: `translateY(${travel(12)})`, offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 1 },
        ],
        { duration: 800, delay: 1000, easing: EASINGS.expo, fill: 'backwards' }
      );

      // Text link [SPEC: 1100ms, 8px, 600ms, quart]
      const textLink = stage.querySelector('.pg-text-link');
      if (textLink) {
        anim(
          textLink,
          [
            { opacity: 0, transform: `translateY(${travel(8)})`, offset: 0 },
            { opacity: 1, transform: 'translateY(0)', offset: 1 },
          ],
          { duration: 600, delay: 1100, easing: EASINGS.quart, fill: 'backwards' }
        );
      }

      // Scroll cue [SPEC: 1250ms, from -6px, 700ms]
      anim(
        scrollCue,
        [
          { opacity: 0, transform: `translateY(${travel(-6)})`, offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 1 },
        ],
        { duration: 700, delay: 1250, easing: EASINGS.expo, fill: 'backwards' }
      );

      // Wait for all to finish, then force redraw and ensure zero inline styles remain
      Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => {
        showFinished();
      });
    }

    return () => {
      clearTimeout(failsafe);
      anims.forEach((a) => {
        try {
          a.cancel();
        } catch (_) {}
      });
      showFinished();
    };
  }, [stageRef, videoRef, isHome]);
}
