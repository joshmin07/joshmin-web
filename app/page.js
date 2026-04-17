'use client';
import { useEffect, useRef, useState } from 'react';
import styles from "./page.module.css";

const BASE = process.env.NODE_ENV === 'production' ? '/JMPortfolio' : '';

// Customizable navigation tabs - edit these to add/remove/reorder tabs
const NAV_TABS = [
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'work-experience', label: 'Work Experience' },
];

const PAGE_LINKS = [
  { label: 'BeastBound', href: `${BASE}/beastbound` },
];

export default function Home() {
  const [expandedProject, setExpandedProject] = useState(null);
  const [lightbox, setLightbox] = useState({ isOpen: false, src: '', alt: '' });
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [slideIndices, setSlideIndices] = useState({});

  const getSlide = (id) => slideIndices[id] ?? 0;
  const setSlide = (id, idx) => setSlideIndices((prev) => ({ ...prev, [id]: idx }));
  const nextSlide = (id, len) => setSlide(id, (getSlide(id) + 1) % len);
  const prevSlide = (id, len) => setSlide(id, (getSlide(id) - 1 + len) % len);
  const navSentinelRef = useRef(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
    // Keep URL in sync without forcing an instant jump.
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!lightbox.isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox.isOpen]);

  useEffect(() => {
    const ids = NAV_TABS.map((t) => t.id);
    const sectionEls = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (best?.target?.id) setActiveSection(best.target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
        // Bias toward the section near the top portion of the screen.
        rootMargin: '-15% 0px -70% 0px',
      }
    );

    sectionEls.forEach((el) => observer.observe(el));

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
    // tabs is stable enough here (constant array content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sentinel = navSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only fix when the sentinel has scrolled ABOVE the viewport.
        // If it's below the viewport (initial load), don't fix.
        const shouldFix = !entry.isIntersecting && (entry.boundingClientRect?.top ?? 0) < 0;
        setIsNavFixed(shouldFix);
      },
      { root: null, threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (src, alt) => {
    setIsZoomed(false);
    setLightbox({ isOpen: true, src, alt });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, src: '', alt: '' });
    setIsZoomed(false);
  };

  const projects = [
    {
      id: 1,
      title: "Moonveil Studios, BeastBound",
      description: "A collaborative project focused on the development of an immersive 2D Top-down rogue-like game using the Unity 2D Engine.",
      technologies: ["C#", "Unity 2D", "GitHub", "C# Unity DOTS", "FMOD", "High Level Shading Language (HLSL)"],
      discordLink: "https://discord.com/invite/k6YFMyvG9C",
      githubLink: "https://github.com/joshmin07",
      pageLink: `${BASE}/beastbound`,
      images: [
        `${BASE}/BB GMPL DT.png`,
        `${BASE}/BB GMPL.png`,
        `${BASE}/BB GMPL2.png`,
        `${BASE}/BBMM.png`,
        `${BASE}/BBSM.png`,
        `${BASE}/BB MLB.png`
      ]
    },
    {
      id: 2,
      title: "Personal Portfolio Website",
      description: "A modern portfolio website to showcase my projects and skills. Using Next.js for server-side rendering and optimized performance.",
      technologies: ["Next.js", "Node.js", "HTML", "CSS", "JavaScript", "GitHub"],
      githubLink: "https://github.com/joshmin07/JoshMinerviniPortfolioWebsite",
      images: [
        `${BASE}/hero.webp`,
        `${BASE}/https___dev-to-uploads.s3.amazonaws.com_uploads_articles_s4wofca420na01zyhzd9.webp`,
        `${BASE}/1697274440798.png`,

      ]
    },
    {
      id: 3,
      title: "C, C++, Python, Java, JavaScript projects.",
      description: "As a Computer Science student, I have completed various courses in these languages, creating small projects that helped me shape my understanding of these languages to be able to use them in real world applications.",
      technologies: ["C", "C++", "C#", "Python", "Java", "PowerShell", "Bash", "HLSL"],
      githubLink: "https://github.com/joshmin07",
      images: [
        `${BASE}/1_9VhBc1smQofu9g6saTOW5g.jpg`,
        `${BASE}/what-is-java.webp`,
        `${BASE}/rxezjyf4ojx41.png`,


      ]
    },

  ];

  const education = [
    {
      id: 1,
      title: "B.S. Undergraduate in Computer Science, University of Central Florida",
      description: "Relevant coursework: Introduction to C Programming, Computer Science I, Object-Oriented Programming, Discrete Structures, Calculus I & II, Physics with Calculus I & II",
      year: "2025-Present"
    },
    {
      id: 2,
      title: "Miami-Dade College, Associate in Arts (Coursework Completed Toward AA; Transferred to UCF)",
      description: "Relevant coursework: Introduction to C++ Programming, Introduction to Python Programming, Introduction to Java Programming, Discrete Mathematics",
      year: "2023-2025",

    },
    {
      id: 3,
      title: "Ronald W. Reagan Doral Senior Highschool Diploma",
      description: "Relevant coursework: 3D and VR Game Development using Unity Engine, Web Design using HTML, CSS, JavaScript with Adobe Dreamweaver, Graphic Design I,II using Adobe Photoshop and Illustrator.",
      year: "Class of 2023"
    }
  ];

  const workExperience = [

    {
      id: 1,
      title: "Pharmacy Customer Service Associate, Walgreens",
      description: "Customer-facing associate with proven experience managing high-volume workflows, processing data accurately under time pressure, and collaborating cross-functionally in a compliance-driven environment.",
      year: "2022-Present",
    },
    {
      id: 2,
      title: "Shift Manager, Wendy's",
      description: "Managed daily operations, supervised staff, and ensured customer satisfaction in a fast-paced environment.",
      year: "2021-2022",
    },
    {
      id: 3,
      title: "JSLD Investments INC, Book-keeping Application Developer",
      description: "Developed a web-based book-keeping application to facilitate financial management and reporting for small businesses.",
      year: "2025-Present",
    }
  ]

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
      {/* Hero Section */}
      <section className={styles.hero}>
        <video 
          className={styles.heroVideo}
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={`${BASE}/Galaxy.mp4`} type="video/mp4" />
        </video>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Josh Minervini</h1>
          <p className={styles.heroSubtitle}>Game/Web Developer & Designer</p>
          <p className={styles.heroDescription}>
            Welcome to my portfolio! I'm Josh Minervini, a passionate developer specializing in Game Development and Web Development. Explore my projects and get in touch!
          </p>
          <div className={styles.heroButtons}>
            <a
              href="#projects"
              className={styles.primaryButton}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('projects');
              }}
            >
              View Projects
            </a>
            <a
              href="#contact"
              className={styles.secondaryButton}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      <div ref={navSentinelRef} className={styles.navSentinel} aria-hidden="true" />
      <div className={styles.stickyNavSlot}>
        <nav
          className={`${styles.stickyNav} ${isNavFixed ? styles.stickyNavFixed : ''}`}
          aria-label="Section navigation"
        >
          <div className={styles.stickyNavInner}>
            {NAV_TABS.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={`${styles.tabLink} ${activeSection === tab.id ? styles.tabLinkActive : ''}`}
                aria-current={activeSection === tab.id ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(tab.id);
                }}
              >
                {tab.label}
              </a>
            ))}
            {PAGE_LINKS.length > 0 && <div className={styles.navDivider} aria-hidden="true" />}
            {PAGE_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={styles.tabLink}>
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* About Section */}
      <section className={styles.section} id="about">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          <p className={styles.aboutText}>
            Hello there! My name is Josh Minervini,
            and I am currently seeking a B.S. in Computer Science at The University of Central Florida.
            I have a passion for Game and Web development and I aspire to become a full-stack developer, specializing in both fields.
            My main goals are to refine my skills with projects or internships where I can learn from senior developers.
            I am eager to contribute to innovative projects and collaborate with like-minded professionals in the tech industry.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.section} id="contact">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.contactText}>
            I'm always open to discussing new projects, creative ideas, or opportunities.
          </p>
          <div className={styles.contactLinks}>
            <a href="mailto:moonveilstudiosbusiness@gmail.com" className={styles.contactButton}>Email Me</a>
            <a href="https://github.com/joshmin07" target="_blank" rel="noopener noreferrer" className={styles.contactButton}>GitHub</a>
            <a href="https://www.linkedin.com/in/joshua-minervini-5711641b9/" target="_blank" rel="noopener noreferrer" className={styles.contactButton}>LinkedIn</a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className={styles.section} id="projects">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={styles.grid}>
            {projects.map((project) => (
              <div
                key={project.id}
                id={`project-${project.id}`}
                className={`${styles.card} ${expandedProject === project.id ? styles.cardExpanded : ''}`}
              >
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.technologies}>
                  {project.technologies.map((tech, index) => (
                    <span key={index} className={styles.tech}>{tech}</span>
                  ))}
                </div>
                
                <div className={`${styles.expandWrapper} ${expandedProject === project.id ? styles.expandWrapperOpen : ''}`}>
                  <div className={styles.expandInner}>
                    {project.images && project.images.length > 0 && (
                      <div className={styles.projectDetails}>
                        <div className={styles.slideshow}>
                          <div className={styles.slidePanel}>
                            <img
                              key={getSlide(project.id)}
                              src={project.images[getSlide(project.id)]}
                              alt={`${project.title} screenshot ${getSlide(project.id) + 1}`}
                              className={styles.slideMedia}
                              onClick={() => openLightbox(project.images[getSlide(project.id)], `${project.title} screenshot ${getSlide(project.id) + 1}`)}
                              decoding="async"
                            />
                            <button className={`${styles.slideArrow} ${styles.slideArrowLeft}`} onClick={() => prevSlide(project.id, project.images.length)} aria-label="Previous slide">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <polyline points="15 18 9 12 15 6"/>
                              </svg>
                            </button>
                            <button className={`${styles.slideArrow} ${styles.slideArrowRight}`} onClick={() => nextSlide(project.id, project.images.length)} aria-label="Next slide">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <polyline points="9 18 15 12 9 6"/>
                              </svg>
                            </button>
                          </div>
                          <div className={styles.slideDots}>
                            {project.images.map((_, i) => (
                              <button
                                key={i}
                                className={`${styles.slideDot} ${i === getSlide(project.id) ? styles.slideDotActive : ''}`}
                                onClick={() => setSlide(project.id, i)}
                                aria-label={`Go to slide ${i + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        {(project.discordLink || project.githubLink || project.pageLink) && (
                          <div className={styles.projectLinks}>
                            {project.pageLink && (
                              <a href={project.pageLink} className={styles.projectLinkButton}>
                                <svg className={styles.linkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                  <line x1="16" y1="13" x2="8" y2="13"/>
                                  <line x1="16" y1="17" x2="8" y2="17"/>
                                  <polyline points="10 9 9 9 8 9"/>
                                </svg>
                                Full Project Page
                              </a>
                            )}
                            {project.discordLink && (
                              <a href={project.discordLink} target="_blank" rel="noopener noreferrer" className={styles.projectLinkButton}>
                                <svg className={styles.linkIcon} viewBox="0 0 127.14 96.36" fill="currentColor">
                                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                                </svg>
                                Discord Server
                              </a>
                            )}
                            {project.githubLink && (
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={styles.projectLinkButton}>
                                <svg className={styles.linkIcon} viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                                </svg>
                                GitHub Page
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const isClosing = expandedProject === project.id;
                    const nextExpanded = isClosing ? null : project.id;
                    setExpandedProject(nextExpanded);
                    if (isClosing) {
                      requestAnimationFrame(scrollToProjects);
                      return;
                    }
                    requestAnimationFrame(() => {
                      const card = document.getElementById(`project-${project.id}`);
                      if (!card) return;
                      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                  }}
                  className={styles.cardLink}
                >
                  {expandedProject === project.id ? 'Hide Details ↑' : 'View Project →'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className={styles.section} id="education">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.achievementsList}>
            {education.map((achievement) => (
              <div key={achievement.id} className={styles.achievementCard}>
                <div className={styles.achievementYear}>{achievement.year}</div>
                <div className={styles.achievementContent}>
                  <h3 className={styles.achievementTitle}>{achievement.title}</h3>
                  <p className={styles.achievementDescription}>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className={styles.section} id="work-experience">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Work Experience</h2>
          <div className={styles.achievementsList}>
            {workExperience.map((job) => (
              <div key={job.id} className={styles.achievementCard}>
                <div className={styles.achievementYear}>{job.year}</div>
                <div className={styles.achievementContent}>
                  <h3 className={styles.achievementTitle}>{job.title}</h3>
                  <p className={styles.achievementDescription}>{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Josh Minervini. All rights reserved.</p>
      </footer>
    </div>
  );
}
