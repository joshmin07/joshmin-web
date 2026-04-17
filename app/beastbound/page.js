'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

const BASE = '';

const NAV_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'development', label: 'Development' },
  { id: 'team', label: 'Team & Links' },
];

// Add more items here — use type: 'video' for .mp4/.webm files, type: 'image' for everything else.
// Videos auto-advance when playback ends; images auto-advance after 5 seconds.
const GALLERY_ITEMS = [
  { src: `${BASE}/BB GMPL DT.png`,  caption: 'Death Screen',        type: 'image' },
  { src: `${BASE}/BB GMPL.png`,  caption: 'Gameplay', type: 'image' },
  { src: `${BASE}/BB GMPL2.png`,  caption: 'Gameplay',  type: 'image' },
  { src: `${BASE}/BBMM.png`,  caption: 'Main Menu',  type: 'image' },
  { src: `${BASE}/BBSM.png`,  caption: 'Save Menu',  type: 'image' },
  { src: `${BASE}/BB MLB.png`,  caption: 'Main Lobby',  type: 'image' }

];

const ICON_RENDERERS = {
  unity: (size, padding) => (
    <img src={`${BASE}/unity-69-logo-black-and-white.png`} alt="Unity logo" className={styles.techIconImg} style={{ width: size, height: size, padding, filter: 'brightness(0) invert(1)' }} aria-hidden="true" />
  ),
  csharp: (size, padding) => (
    <img src={`${BASE}/Csharp_Logo.png`} alt="C# logo" className={styles.techIconImg} style={{ width: size, height: size, padding }} aria-hidden="true" />
  ),
  aseprite: (size, padding) => (
    <img src={`${BASE}/Logo_Aseprite.svg.png`} alt="Aseprite logo" className={styles.techIconImg} style={{ width: size, height: size, padding }} aria-hidden="true" />
  ),
  fmod: (size, padding) => (
    <img src={`${BASE}/fmod_logo_icon_248525.webp`} alt="FMOD logo" className={styles.techIconImg} style={{ width: size, height: size, padding, filter: 'brightness(0) invert(1)' }} aria-hidden="true" />
  ),
  github: (size, padding) => (
    <svg className={styles.techIconSvg} style={{ width: size, height: size, padding }} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  ),
};

// Adjust iconSize and iconPadding for each entry to tune how each logo appears
const TECH_STACK = [
  { iconKey: 'unity',    iconSize: '2.25rem', iconPadding: '0',      name: 'Unity 2D', desc: 'Core game engine for rendering, physics, and scene management' },
  { iconKey: 'csharp',   iconSize: '3.5rem', iconPadding: '0',      name: 'C#',       desc: 'Primary scripting language for all game logic and systems' },
  { iconKey: 'fmod',     iconSize: '4rem', iconPadding: '0',      name: 'FMOD',     desc: 'Professional audio engine for dynamic sound design and music systems' },
  { iconKey: 'aseprite', iconSize: '2.25rem', iconPadding: '0',      name: 'Aseprite', desc: 'Hand-crafted sprites and tilesets created for the game world' },
  { iconKey: 'github',   iconSize: '2.25rem', iconPadding: '0',      name: 'GitHub',   desc: 'Version control and collaborative development across the team' },
];

export default function BeastBound() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [lightbox, setLightbox] = useState({ isOpen: false, src: '', alt: '' });
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navSentinelRef = useRef(null);

  const nextSlide = () => setCurrentSlide((c) => (c + 1) % GALLERY_ITEMS.length);
  const prevSlide = () => setCurrentSlide((c) => (c - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);

  // Auto-advance images after 5 s; videos advance via onEnded
  useEffect(() => {
    if (GALLERY_ITEMS[currentSlide].type === 'video') return;
    const timer = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  const openLightbox = (src, alt) => {
    setIsZoomed(false);
    setLightbox({ isOpen: true, src, alt });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, src: '', alt: '' });
    setIsZoomed(false);
  };

  useEffect(() => {
    if (!lightbox.isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [lightbox.isOpen]);

  useEffect(() => {
    const ids = NAV_TABS.map((t) => t.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (best?.target?.id) setActiveSection(best.target.id);
      },
      { root: null, threshold: [0.15, 0.25, 0.35, 0.5, 0.65], rootMargin: '-15% 0px -70% 0px' }
    );

    els.forEach((el) => observer.observe(el));

    const syncFromHash = () => {
      const id = window.location.hash?.slice(1);
      if (id && ids.includes(id)) setActiveSection(id);
    };
    window.addEventListener('hashchange', syncFromHash);
    syncFromHash();

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncFromHash);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sentinel = navSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldFix = !entry.isIntersecting && (entry.boundingClientRect?.top ?? 0) < 0;
        setIsNavFixed(shouldFix);
      },
      { root: null, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {lightbox.isOpen && (
        <div className={styles.lightboxOverlay} role="dialog" aria-modal="true" aria-label="Media preview">
          <div className={`${styles.lightboxContent} ${isZoomed ? styles.lightboxContentZoomed : ''}`}>
            <button type="button" className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close preview">
              <svg className={styles.lightboxCloseIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className={styles.lightboxImageContainer}>
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className={`${styles.lightboxImage} ${isZoomed ? styles.lightboxImageZoomed : ''}`}
                onClick={() => setIsZoomed((z) => !z)}
                decoding="async"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className={styles.hero}>
        <video className={styles.heroVideo} autoPlay loop muted playsInline>
          <source src={`${BASE}/Galaxy.mp4`} type="video/mp4" />
        </video>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <img src={`${BASE}/MoonveilLogoNoBG.png`} alt="Moonveil Studios" className={styles.heroBadgeLogo} />
          </div>
          <h1 className={styles.heroTitle}>BeastBound</h1>
          <p className={styles.heroSubtitle}>2D Top-Down Roguelike</p>
          <p className={styles.heroDescription}>
            An immersive rogue-like adventure built in Unity 2D, featuring hand-crafted pixel art, procedural challenges, and fast-paced combat.
          </p>
          <div className={styles.heroButtons}>
            <a
              href="#gallery"
              className={styles.primaryButton}
              onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}
            >
              View Gallery
            </a>
            <a
              href="https://discord.com/invite/k6YFMyvG9C"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              Join Discord
            </a>
          </div>
        </div>
      </section>

      <div ref={navSentinelRef} className={styles.navSentinel} aria-hidden="true" />
      <div className={styles.stickyNavSlot}>
        <nav
          className={`${styles.stickyNav} ${isNavFixed ? styles.stickyNavFixed : ''}`}
          aria-label="Page navigation"
        >
          <div className={styles.stickyNavInner}>
            <a href={`${BASE}/`} className={styles.backLink}>← Portfolio</a>
            <div className={styles.navDivider} aria-hidden="true" />
            {NAV_TABS.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={`${styles.tabLink} ${activeSection === tab.id ? styles.tabLinkActive : ''}`}
                aria-current={activeSection === tab.id ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); scrollToSection(tab.id); }}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Overview */}
      <section className={styles.section} id="overview">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.overviewGrid}>
            <div>
              <div className={styles.overviewText}>
                <p>
                  BeastBound is a collaborative 2D top-down roguelike developed under the Moonveil Studios banner.
                  Players explore multiple levels with different environments, battle a variety of enemies, and challenge themselves in a difficult fast-paced combat game.
                </p>
                <p>
                  The game blends classic roguelike mechanics with modern Unity tooling, including Unity DOTS and HLSL for
                  high-performance entity processing that keeps combat snappy even when dozens of enemies are on screen.
                </p>
                <p>
                  All art assets are hand-crafted pixel art designed to evoke the feel of classic 32-bit dungeon crawlers
                  while maintaining a distinctive visual identity.
                </p>
              </div>
              <div className={styles.tagList}>
                {['Roguelike', '2D', 'Top-Down', 'Dungeon Crawler', 'Unity', 'Indie', 'Co-op'].map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureTitle}>Key Features</div>
              <ul className={styles.featureList}>
                {[
                  'Breath-taking dungeon style levels with multiple to explore',
                  'Fast-paced top-down combat system',
                  'Unique enemies with distinct appearances and smart AI',
                  '3 unique classes with different playstyles',
                  'Hand-crafted pixel art sprites and tilesets',
                  'Persistent progression across runs',
                  'Active community Discord server',
                ].map((feat) => (
                  <li key={feat}>
                    <span className={styles.featureBullet}>›</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className={styles.section} id="gallery">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Gallery</h2>
          <div className={styles.slideshow}>
            <div className={styles.slidePanel}>
              {GALLERY_ITEMS[currentSlide].type === 'video' ? (
                <video
                  key={currentSlide}
                  className={styles.slideMedia}
                  autoPlay
                  muted
                  playsInline
                  onEnded={nextSlide}
                >
                  <source src={GALLERY_ITEMS[currentSlide].src} />
                </video>
              ) : (
                <img
                  key={currentSlide}
                  src={GALLERY_ITEMS[currentSlide].src}
                  alt={GALLERY_ITEMS[currentSlide].caption}
                  className={styles.slideMedia}
                  onClick={() => openLightbox(GALLERY_ITEMS[currentSlide].src, GALLERY_ITEMS[currentSlide].caption)}
                  decoding="async"
                />
              )}
              <button className={`${styles.slideArrow} ${styles.slideArrowLeft}`} onClick={prevSlide} aria-label="Previous slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button className={`${styles.slideArrow} ${styles.slideArrowRight}`} onClick={nextSlide} aria-label="Next slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
            <div className={styles.slideCaption}>{GALLERY_ITEMS[currentSlide].caption}</div>
            <div className={styles.slideDots}>
              {GALLERY_ITEMS.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.slideDot} ${i === currentSlide ? styles.slideDotActive : ''}`}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Development */}
      <section className={styles.section} id="development">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Development</h2>
          <div className={styles.techGrid}>
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className={styles.techCard}>
                {ICON_RENDERERS[tech.iconKey](tech.iconSize, tech.iconPadding)}
                <div className={styles.techName}>{tech.name}</div>
                <div className={styles.techDesc}>{tech.desc}</div>
              </div>
            ))}
          </div>
          <div className={styles.devNotes}>
            <p>
              BeastBound started as a passion project to expand my coding and design skills. FMOD was integrated early in development to handle dynamic audio and adaptive
              music that responds to combat intensity, spatial sound effects, and layered ambient tracks
              that shift as players progresses throughg the game.
            </p>
            <p>
              The art pipeline is managed by Hector Pellicioni, sprites start as 3D models where we use rendering techniques to adapt them to 2D 32-bit pixel art.
            </p>
            <p>
              GitHub is used for all version control with a branch-per-feature workflow. Pull requests are
              reviewed before merging to keep the main branch stable and playable at all times.
            </p>
          </div>
        </div>
      </section>

      {/* Team & Links */}
      <section className={styles.section} id="team">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Team &amp; Links</h2>
          <div className={styles.linksSection}>
            <p className={styles.linksText}>
              BeastBound is developed by Moonveil Studios, comprised of Josh Minervini (Lead Developer) and Hector Pellicioni (Lead Graphic Designer & Animator). Two University students at the University of Central Florida with a passion for video games. Join our community discord server to chat and follow our progress!
            </p>
            <div className={styles.linkButtons}>
              <a
                href="https://discord.com/invite/k6YFMyvG9C"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                <svg className={styles.linkIcon} viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
                Discord Server
              </a>
              <a
                href="https://github.com/joshmin07"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                <svg className={styles.linkIcon} viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 Moonveil Studios · Josh Minervini. All rights reserved.</p>
      </footer>
    </div>
  );
}
