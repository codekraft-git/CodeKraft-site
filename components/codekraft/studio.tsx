"use client";

import { useState, useCallback } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
  ScanLine,
  Mail,
  Camera as Instagram,
  Check,
  Code2,
  Server,
  Zap,
  Shield,
  Cpu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brand } from "./brand";
import { navigation, projects, products, services } from "./content";
import { ProjectPreview } from "./project-preview";
import { ContactForm } from "./contact-form";
import { useScrollMotion } from "./use-scroll-motion";
import { SmokeCanvas } from "./smoke-canvas";
import { CosmicBackdrop } from "./cosmic-backdrop";
import { InfiniteSliderBasic } from "@/components/core/infinite-slider-basic";
import { GlowEffect } from "@/components/core/glow-effect";

const studioMetrics = [
  {
    metric: "99.99%",
    label: "ENTERPRISE AVAILABILITY",
    detail: "Fault-tolerant multi-region cloud architecture with automated failover & active SLA.",
    badge: "Active SLA",
    icon: Server,
  },
  {
    metric: "< 35ms",
    label: "GLOBAL EDGE LATENCY",
    detail: "Sub-millisecond routing across global edge nodes with intelligent caching layers.",
    badge: "Edge Mesh",
    icon: Zap,
  },
  {
    metric: "Zero-Trust",
    label: "DEFENSE ARCHITECTURE",
    detail: "Cryptographic identity verification, automated SAST/DAST gates, and continuous audits.",
    badge: "SOC 2 Ready",
    icon: Shield,
  },
  {
    metric: "100%",
    label: "TYPE-SAFE INTEGRITY",
    detail: "Strict TypeScript discipline, scalable microservices, and end-to-end integration rigor.",
    badge: "Strict CI/CD",
    icon: Cpu,
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow"><span/>{children}</span>;
}

function ScrollHeading({ id, first, second }: { id: string; first: string; second: string }) {
  return <h2 id={id}><span className="heading-line"><span>{first}</span></span>{" "}<span className="heading-line"><span className="heading-accent">{second}</span></span></h2>;
}

function ProjectCard({ project, onMouseMove, onStartProject }: { project: (typeof projects)[number]; onMouseMove: (e: React.MouseEvent<HTMLElement>) => void; onStartProject?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="project-card reveal" onMouseMove={onMouseMove}>
      <div className="card-ambient-spotlight" aria-hidden="true"/>
      <ProjectPreview variant={project.visual}/>
      <div className="project-info">
        <div className="project-category">
          <span>{project.category}</span>
          <span className="concept-tag"><span className="pulse-dot"/>Concept study</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-bottom">
          <div className="tech-tags">
            {project.technologies.map(tech => <span key={tech}>{tech}</span>)}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="text-link" type="button" aria-label={`View project: ${project.name}`}>
                View Project <ArrowUpRight size={17}/>
              </button>
            </DialogTrigger>
            <DialogContent className="project-dialog">
              <span className="eyebrow">STUDIO CONCEPT / {project.number}</span>
              <DialogTitle>{project.name}</DialogTitle>
              <DialogDescription>{project.overview}</DialogDescription>
              <ProjectPreview variant={project.visual}/>
              <h4>What the concept explores</h4>
              <ul className="scope-list">{project.scope.map(item => <li key={item}><Check size={16}/>{item}</li>)}</ul>
              <h4>The approach</h4>
              <p>{project.approach}</p>
              <p className="concept-note">An illustrative CodeKraft studio study, not a published client case study. Technologies show the proposed implementation stack.</p>
              <button type="button" className="button button-primary" onClick={() => { setOpen(false); onStartProject?.(); }}>Build something like this <ArrowRight size={16}/></button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </article>
  );
}

export function Studio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { rootRef, activeSection, scrolled } = useScrollMotion();

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return (
    <div className="studio" ref={rootRef}>
      <CosmicBackdrop active={true} />
      <div className="reading-progress" aria-hidden="true"><span/></div>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className={`site-header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="header-inner">
          <Brand/>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(name => (
              <a key={name} href={`#${name.toLowerCase()}`} aria-current={activeSection === name.toLowerCase() ? "location" : undefined}>
                {name}
              </a>
            ))}
          </nav>
          <button type="button" className="button button-header" onClick={() => setContactOpen(true)}>Start a Project <ArrowRight size={15}/></button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="menu-toggle" type="button" aria-label="Open navigation"><Menu size={23}/></button>
            </SheetTrigger>
            <SheetContent className="mobile-menu">
              <SheetTitle className="sr-only">CodeKraft navigation</SheetTitle>
              <SheetDescription className="sr-only">Explore the studio and start your project.</SheetDescription>
              <Brand/>
              <nav aria-label="Mobile navigation">
                {navigation.map((name, i) => (
                  <a key={name} href={`#${name.toLowerCase()}`} aria-current={activeSection === name.toLowerCase() ? "location" : undefined} onClick={() => setMenuOpen(false)}>
                    <span>{String(i + 1).padStart(2, "0")}</span>{name}<ArrowUpRight size={18}/>
                  </a>
                ))}
              </nav>
              <button type="button" className="button button-primary" onClick={() => { setMenuOpen(false); setContactOpen(true); }}>Start a Project <ArrowRight size={16}/></button>
              <a className="mobile-email" href="mailto:codekraft.pvt@gmail.com">codekraft.pvt@gmail.com</a>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main id="main-content">
        <div className="hero-scroll-stage" id="home">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-atmosphere" aria-hidden="true">
              <img className="smoke-base" src="/assets/atmosphere.webp" width="1672" height="941" alt="" fetchPriority="high" draggable={false}/>
              <div className="hero-smoke hero-smoke-left"><img src="/assets/atmosphere.webp" width="1672" height="941" alt="" fetchPriority="high" draggable={false}/></div>
              <div className="hero-smoke hero-smoke-right"><img src="/assets/atmosphere.webp" width="1672" height="941" alt="" fetchPriority="high" draggable={false}/></div>
              <SmokeCanvas/>
              <div className="hero-glow"><div className="hero-light"/><div className="hero-vignette"/></div>
            </div>
            <div className="hero-brand" aria-hidden="true">
              <div className="hero-logo-glow" />
              <img
                className="hero-logo"
                src="/assets/ck-glass-watermark.png"
                width="1024"
                height="1024"
                alt="CodeKraft"
                fetchPriority="high"
                draggable={false}
              />
            </div>
            <div className="hero-content">
              <Eyebrow>TECHNOLOGY STUDIO</Eyebrow>
              <h1 id="hero-title">Digital Products,<br/><span>Built to Work.</span></h1>
              <p>CodeKraft designs, builds and secures modern digital<br className="hero-copy-break"/> products, software and technology solutions.</p>
              <div className="hero-actions">
                <button type="button" className="button button-primary" onClick={() => setContactOpen(true)}>Start a Project <ArrowRight size={15}/></button>
                <a href="#projects" className="button button-secondary">View Our Work <ArrowRight size={15}/></a>
              </div>
            </div>
            <a href="#services" className="scroll-indicator" aria-label="Scroll to explore services">
              <span className="scroll-line"/>
              <span className="scroll-mouse"><span/></span>
              <span>SCROLL TO EXPLORE</span>
            </a>
          </section>
        </div>

        <section id="services" className="section services-section" aria-labelledby="services-title">
          <div className="section-ambient-glow" aria-hidden="true"/>
          <div className="section-inner">
            <div className="section-heading reveal">
              <div>
                <Eyebrow>WHAT WE DO</Eyebrow>
                <ScrollHeading id="services-title" first="From the first idea." second="To what comes next."/>
              </div>
              <p>Design, engineering, and security.<br/>The right expertise, working together to<br className="desktop-break"/> build something that lasts.</p>
            </div>
            <div className="services-grid">
              {services.map((service, index) => (
                <a
                  href="#contact"
                  key={service.title}
                  className="service-card reveal"
                  aria-label={`Discuss ${service.title}`}
                  onMouseMove={handleCardMouseMove}
                >
                  <div className="card-ambient-spotlight" aria-hidden="true"/>
                  <div className="service-top">
                    <div className="service-icon-box"><service.icon size={24} strokeWidth={1.3}/></div>
                    <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="service-bottom-bar">
                    <span className="service-explore-text">Explore capability</span>
                    <ArrowUpRight className="service-arrow" size={18}/>
                  </div>
                </a>
              ))}
            </div>

            <InfiniteSliderBasic />

            {/* Studio Metrics HUD Strip */}
            <div className="studio-stats-strip reveal">
              <div className="stats-strip-header">
                <div className="stats-strip-title-wrap">
                  <span className="stats-accent-line" />
                  <span className="stats-strip-title">ARCHITECTURAL RIGOR &amp; METRICS</span>
                </div>
                <span className="concept-tag">
                  <span className="pulse-dot pulse-dot-green" />
                  Continuous Production SLA
                </span>
              </div>
              <div className="stats-grid">
                {studioMetrics.map((item) => (
                  <div
                    key={item.label}
                    className="stat-card"
                    onMouseMove={handleCardMouseMove}
                  >
                    <div className="card-ambient-spotlight" aria-hidden="true" />
                    <div className="stat-card-top">
                      <div className="stat-icon-wrap">
                        <item.icon size={18} strokeWidth={1.4} />
                      </div>
                      <span className="stat-badge">{item.badge}</span>
                    </div>
                    <div className="stat-metric">{item.metric}</div>
                    <div className="stat-label">{item.label}</div>
                    <p className="stat-detail">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section projects-section" aria-labelledby="projects-title">
          <div className="section-ambient-glow" aria-hidden="true"/>
          <div className="section-inner">
            <div className="section-heading reveal">
              <div>
                <Eyebrow>WORK &amp; EXPLORATIONS</Eyebrow>
                <ScrollHeading id="projects-title" first="Thoughtful by design." second="Purposeful in every detail."/>
              </div>
              <p>A look at how we approach digital products.<br/>The following studio concepts illustrate<br className="desktop-break"/> our design and engineering direction.</p>
            </div>
            <div className="projects-grid">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} onMouseMove={handleCardMouseMove} onStartProject={() => setContactOpen(true)} />
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="section products-section" aria-labelledby="products-title">
          <div className="section-ambient-glow" aria-hidden="true"/>
          <div className="section-inner">
            <div className="section-heading reveal">
              <div>
                <Eyebrow>BUILT AT CODEKRAFT</Eyebrow>
                <ScrollHeading id="products-title" first="Ideas with a purpose." second="Products with potential."/>
              </div>
              <p>Exploring better tools for the way we work.<br/>These early product concepts are part<br className="desktop-break"/> of our studio’s direction.</p>
            </div>
            <div className="products-grid">
              {products.map(product => {
                const isFeatured = product.name === "KraftGuard";
                return (
                  <article
                    className={`product-card reveal ${isFeatured ? "product-card-featured" : ""}`}
                    key={product.name}
                    onMouseMove={handleCardMouseMove}
                  >
                    {isFeatured && (
                      <GlowEffect
                        colors={["#00e5ff", "#3b82f6", "#8b5cf6", "#06b6d4"]}
                        mode="breathe"
                        blur="medium"
                        duration={6}
                        scale={1.03}
                        className="product-featured-glow"
                      />
                    )}
                    <div className="card-ambient-spotlight" aria-hidden="true"/>
                    <div className="product-top">
                      <div className="product-icon-box">
                        <product.icon size={28} strokeWidth={1.1}/>
                      </div>
                      <span className={`concept-tag ${isFeatured ? "concept-tag-featured" : ""}`}>
                        <span className={`pulse-dot ${isFeatured ? "pulse-dot-cyan" : ""}`}/>
                        {isFeatured ? "Flagship Lab" : "Studio Lab"}
                      </span>
                    </div>
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <a href="#contact" className="text-link">Discuss this idea <ArrowRight size={17}/></a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="security" className="section security-section" aria-labelledby="security-title">
          <div className="section-ambient-glow" aria-hidden="true"/>
          <div className="section-inner security-layout">
            <div className="security-intro reveal">
              <div className="security-hud-pill">
                <span className="radar-blip"/>
                <span>ZERO TRUST ARCHITECTURE · CONTINUOUS DEFENSE</span>
              </div>
              <Eyebrow>SECURITY IS FOUNDATIONAL</Eyebrow>
              <ScrollHeading id="security-title" first="Confidence." second="Built into every layer."/>
              <p>Good technology earns trust. We bring a security mindset to how products are designed, built, tested, and maintained.</p>
              <div className="security-cta-wrap">
                <a href="#contact" className="button button-secondary">Talk Security <ArrowRight size={16}/></a>
              </div>

              {/* Real-time Defense Telemetry HUD */}
              <div className="security-telemetry-hud" onMouseMove={handleCardMouseMove}>
                <div className="card-ambient-spotlight" aria-hidden="true" />
                <div className="telemetry-header">
                  <div className="telemetry-title-wrap">
                    <span className="radar-blip" />
                    <span className="telemetry-title">DEFENSE POSTURE TELEMETRY</span>
                  </div>
                  <span className="telemetry-badge">
                    <span className="pulse-dot pulse-dot-green" />
                    SYSTEMS NOMINAL
                  </span>
                </div>
                <div className="telemetry-grid">
                  <div className="telemetry-chip">
                    <span className="chip-bullet bullet-green" />
                    <div>
                      <strong>TLS 1.3 Strict &amp; HSTS</strong>
                      <small>Grade A+ SSL Verification</small>
                    </div>
                  </div>
                  <div className="telemetry-chip">
                    <span className="chip-bullet bullet-cyan" />
                    <div>
                      <strong>OWASP Top 10 Hardened</strong>
                      <small>Active Input &amp; API Guard</small>
                    </div>
                  </div>
                  <div className="telemetry-chip">
                    <span className="chip-bullet bullet-blue" />
                    <div>
                      <strong>Continuous SAST/DAST Gates</strong>
                      <small>Automated CI/CD Scans</small>
                    </div>
                  </div>
                  <div className="telemetry-chip">
                    <span className="chip-bullet bullet-purple" />
                    <div>
                      <strong>Zero-CVE Dependency Shield</strong>
                      <small>Real-Time Vulnerability Audit</small>
                    </div>
                  </div>
                </div>
                <div className="telemetry-footer">
                  <span>SOC 2 &amp; ISO 27001 Preparedness</span>
                  <span className="telemetry-dot">•</span>
                  <span>Zero Trust Network Access</span>
                </div>
              </div>

              <div className="security-principle">
                <div className="shield-glow-wrap"><ShieldCheck size={26} strokeWidth={1.2}/></div>
                <div><strong>Secure by Design</strong><p>Considered from the first decision.</p></div>
              </div>
            </div>

            <div className="security-details">
              <div className="security-detail reveal" onMouseMove={handleCardMouseMove}>
                <div className="card-ambient-spotlight" aria-hidden="true"/>
                <div className="security-icon-box"><ScanLine size={23} strokeWidth={1.3}/></div>
                <div><h3>Security Assessment</h3><p>Understand your exposure and turn findings into a clear, actionable plan.</p></div>
              </div>
              <div className="security-detail reveal" onMouseMove={handleCardMouseMove}>
                <div className="card-ambient-spotlight" aria-hidden="true"/>
                <div className="security-icon-box"><Code2 size={23} strokeWidth={1.3}/></div>
                <div><h3>Web &amp; API Security</h3><p>Review the interfaces, access controls, and data flows your users depend on.</p></div>
              </div>
              <div className="security-detail reveal" onMouseMove={handleCardMouseMove}>
                <div className="card-ambient-spotlight" aria-hidden="true"/>
                <div className="security-icon-box"><LockKeyhole size={23} strokeWidth={1.3}/></div>
                <div><h3>Application &amp; Infrastructure Security</h3><p>Strengthen your software and the environments that keep it running.</p></div>
              </div>
              <div className="security-detail reveal" onMouseMove={handleCardMouseMove}>
                <div className="card-ambient-spotlight" aria-hidden="true"/>
                <div className="security-icon-box"><Fingerprint size={23} strokeWidth={1.3}/></div>
                <div><h3>Penetration Testing</h3><p>Authorized, scoped testing to find weaknesses before they become incidents.</p></div>
              </div>
              <span className="security-footnote reveal"><ShieldCheck size={14}/> Clear scope. Practical findings. Responsible testing.</span>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section" aria-labelledby="about-title">
          <div className="section-ambient-glow" aria-hidden="true"/>
          <div className="section-inner">
            <div className="about-layout">
              <div className="about-heading reveal">
                <Eyebrow>THE STUDIO</Eyebrow>
                <ScrollHeading id="about-title" first="Practical minds." second="Thoughtful technology."/>
              </div>
              <div className="about-copy reveal">
                <p>CodeKraft builds practical digital products engineered for real-world use.</p>
                <p>We combine software engineering, product design and security-minded development to create technology that works reliably.</p>
                <p>From an early idea to the details that make a product feel right, we care about the work—and the people who use it.</p>
              </div>
            </div>
            <div className="principles-grid">
              <div className="principle-card reveal" onMouseMove={handleCardMouseMove}>
                <div className="card-ambient-spotlight" aria-hidden="true"/>
                <div className="principle-glow" aria-hidden="true"/>
                <span className="principle-tag">01 / BUILD</span>
                <h3>Make it useful.</h3>
                <p>Start with a real problem. Build with purpose.</p>
              </div>
              <div className="principle-card reveal" onMouseMove={handleCardMouseMove}>
                <div className="card-ambient-spotlight" aria-hidden="true"/>
                <div className="principle-glow" aria-hidden="true"/>
                <span className="principle-tag">02 / SECURE</span>
                <h3>Make it dependable.</h3>
                <p>Protect the experience and the trust behind it.</p>
              </div>
              <div className="principle-card reveal" onMouseMove={handleCardMouseMove}>
                <div className="card-ambient-spotlight" aria-hidden="true"/>
                <div className="principle-glow" aria-hidden="true"/>
                <span className="principle-tag">03 / INNOVATE</span>
                <h3>Make it better.</h3>
                <p>Stay curious. Keep improving what comes next.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section" aria-labelledby="contact-title">
          <div className="section-ambient-glow" aria-hidden="true"/>
          <div className="section-inner contact-layout">
            <div className="contact-copy reveal">
              <Eyebrow>LET’S MAKE IT HAPPEN</Eyebrow>
              <ScrollHeading id="contact-title" first="Let’s Build" second="Something Great."/>
              <p>An idea, a challenge, or a new direction.<br/>We’d like to hear what you have in mind.</p>
              <div className="contact-links">
                <a href="mailto:codekraft.pvt@gmail.com">
                  <Mail size={20} strokeWidth={1.3}/>
                  <span><small>EMAIL US</small>codekraft.pvt@gmail.com</span>
                  <ArrowUpRight size={17}/>
                </a>
                <a href="https://www.instagram.com/codecraft.ig/" target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} strokeWidth={1.3}/>
                  <span><small>INSTAGRAM</small>@codecraft.ig</span>
                  <ArrowUpRight size={17}/>
                </a>
              </div>
            </div>
            <div className="contact-form-wrap contact-cta-card reveal" onMouseMove={handleCardMouseMove}>
              <div className="card-ambient-spotlight" aria-hidden="true"/>
              <div className="form-ambient-halo" aria-hidden="true"/>
              <div className="contact-cta-content">
                <span className="principle-tag">DIRECT INQUIRY</span>
                <h3>Ready to discuss your product or project?</h3>
                <p>
                  Share your technical requirements, project scope, or architecture challenges with our team.
                  We review every inquiry directly and provide structured, actionable next steps.
                </p>
                <div className="contact-cta-badges">
                  <span className="cta-badge"><ShieldCheck size={15}/> Confidential &amp; NDA Ready</span>
                  <span className="cta-badge"><Zap size={15}/> &lt; 24h Architect Response</span>
                  <span className="cta-badge"><Cpu size={15}/> End-to-End Technical Scope</span>
                </div>
                <div className="contact-cta-actions">
                  <button
                    type="button"
                    className="button button-primary button-cta-launch"
                    onClick={() => setContactOpen(true)}
                  >
                    <span>Send Us a Message</span>
                    <ArrowRight size={16}/>
                  </button>
                  <span className="cta-subnote">Opens project brief • Takes ~60 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="contact-dialog">
          <div className="contact-dialog-header">
            <span className="eyebrow"><span/>PROJECT INQUIRY</span>
            <DialogTitle>Let’s Build Something Great.</DialogTitle>
            <DialogDescription>
              Tell us about your project, timeline, and goals. We’ll get back to you within 24 hours.
            </DialogDescription>
          </div>
          <ContactForm/>
        </DialogContent>
      </Dialog>
    </div>
  );
}

