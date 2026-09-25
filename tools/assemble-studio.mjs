import fs from 'node:fs';
import path from 'node:path';

const studioDir = path.resolve('studio');
const extractedMarkupPath = path.join(studioDir, 'extracted-markup.html');
const rawHtml = fs.readFileSync(extractedMarkupPath, 'utf8');

// Replace absolute root paths with relative paths
let processedMarkup = rawHtml
  .replace(/href="\/" style="color:#38bdf8;font-weight:600">← Showroom<\/a>/g, 'href="../" style="color:#38bdf8;font-weight:600">← Showroom</a>')
  .replace(/\/assets\//g, 'assets/')
  .replace(/\/([a-z0-9_]+_logo\.svg)/g, '$1')
  .replace(/fetchPriority="high"/g, 'fetchpriority="high"');

// Fix tech slider marquee track for smooth CSS looping
processedMarkup = processedMarkup.replace(
  '<div class="flex flex-nowrap w-max" style="gap:24px;transform:none">',
  '<div class="tech-marquee-track flex flex-nowrap w-max" style="gap:24px">'
);

// Add unique identifiers to Project View buttons so we can attach modal triggers
// In raw markup:
// 1st button: <button class="text-link" type="button" aria-label="View project: Learning platform"
// 2nd button: <button class="text-link" type="button" aria-label="View project: Operations workspace"
processedMarkup = processedMarkup.replace(
  'aria-label="View project: Learning platform"',
  'aria-label="View project: Learning platform" data-open-project="learning"'
);
processedMarkup = processedMarkup.replace(
  'aria-label="View project: Operations workspace"',
  'aria-label="View project: Operations workspace" data-open-project="operations"'
);

// Wire "Start a Project" and "Send Us a Message" buttons to contact modal
processedMarkup = processedMarkup.replace(
  '<button type="button" class="button button-header">Start a Project',
  '<button type="button" class="button button-header" data-open-contact>Start a Project'
);
processedMarkup = processedMarkup.replace(
  '<button type="button" class="button button-primary">Start a Project',
  '<button type="button" class="button button-primary" data-open-contact>Start a Project'
);
processedMarkup = processedMarkup.replace(
  '<button type="button" class="button button-primary button-cta-launch">',
  '<button type="button" class="button button-primary button-cta-launch" data-open-contact>'
);
processedMarkup = processedMarkup.replace(
  '<a href="#contact" class="button button-secondary">Talk Security',
  '<button type="button" class="button button-secondary" data-open-contact data-subject="Cybersecurity">Talk Security'
);

// Wire Service cards and Product cards to contact modal or anchor
processedMarkup = processedMarkup.replace(
  /<a href="#contact" class="service-card reveal" aria-label="Discuss ([^"]+)">/g,
  '<a href="#contact" class="service-card reveal" aria-label="Discuss $1" data-service-type="$1">'
);
processedMarkup = processedMarkup.replace(
  /<a href="#contact" class="text-link">Discuss this idea/g,
  '<button type="button" class="text-link" data-open-contact data-subject="Product Concept">Discuss this idea</button>'
);

const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CODEKRAFT STUDIO — Digital Products, Built to Work</title>
  <meta name="description" content="CodeKraft Studio designs, builds and secures modern digital products, software and technology solutions. Explore our flagship engineering showcase, architecture metrics, and digital concepts.">
  <meta name="keywords" content="CodeKraft Studio, digital products, software engineering, UI UX design, web development, cybersecurity, cloud architecture, technology showcase, flagship agency">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="author" content="CodeKraft">
  <meta name="publisher" content="CodeKraft">
  <meta name="theme-color" content="#060913">
  <link rel="canonical" href="https://www.codekraft.online/studio/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="CodeKraft Studio">
  <meta property="og:url" content="https://www.codekraft.online/studio/">
  <meta property="og:title" content="CODEKRAFT STUDIO — Digital Products, Built to Work">
  <meta property="og:description" content="CodeKraft designs, builds and secures modern digital products, software and technology solutions. Explore our engineering showcase.">
  <meta property="og:image" content="https://www.codekraft.online/assets/previews/studio.jpg">
  <meta property="og:image:secure_url" content="https://www.codekraft.online/assets/previews/studio.jpg">
  <meta property="og:image:width" content="1440">
  <meta property="og:image:height" content="1080">
  <meta property="og:image:alt" content="CodeKraft Studio Digital Products Experience">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:domain" content="codekraft.online">
  <meta name="twitter:url" content="https://www.codekraft.online/studio/">
  <meta name="twitter:title" content="CODEKRAFT STUDIO — Digital Products, Built to Work">
  <meta name="twitter:description" content="Digital products, built to work. Software engineering, product design, and interactive cosmic experience.">
  <meta name="twitter:image" content="https://www.codekraft.online/assets/previews/studio.jpg">
  <link rel="icon" type="image/svg+xml" href="../assets/icons/codekraft.svg">
  <script>if(location.pathname&&!location.pathname.endsWith('/')&&!location.pathname.endsWith('.html')){location.replace(location.pathname+'/'+location.search+location.hash);}</script>
  <link rel="stylesheet" href="studio.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "CODEKRAFT STUDIO — Digital Products, Built to Work",
    "url": "https://www.codekraft.online/studio/",
    "description": "CodeKraft designs, builds and secures modern digital products, software and technology solutions.",
    "isPartOf": {
      "@type": "WebSite",
      "name": "CodeKraft",
      "url": "https://www.codekraft.online/"
    },
    "about": {
      "@type": "Service",
      "name": "Digital Product Studio & Custom Software Engineering",
      "provider": {
        "@type": "Organization",
        "name": "CodeKraft",
        "url": "https://www.codekraft.online/"
      }
    }
  }
  </script>
  <style>
    /* Continuous Hardware-Accelerated Marquee */
    .tech-marquee-track {
      display: flex;
      width: max-content;
      animation: techMarqueeScroll 35s linear infinite;
      will-change: transform;
    }
    .tech-marquee-track:hover {
      animation-play-state: paused;
    }
    @keyframes techMarqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-33.333% - 16px)); }
    }
    @media (max-width: 768px) {
      .tech-marquee-track {
        animation-duration: 25s;
      }
    }

    /* Modal Portals */
    .studio-modal-portal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      visibility: visible;
      opacity: 1;
      transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
    }
    .studio-modal-portal[hidden] {
      display: none !important;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .studio-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.82);
      -webkit-backdrop-filter: blur(14px);
      backdrop-filter: blur(14px);
      z-index: 1;
    }
    .studio-modal-container {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-height: 94svh;
    }
    .studio-modal-close {
      position: absolute;
      top: 18px;
      right: 18px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #9ab4cc;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background 0.2s, border-color 0.2s;
      z-index: 15;
    }
    .studio-modal-close:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.28);
    }
    .project-dialog, .contact-dialog {
      position: relative;
    }

    /* Mobile Drawer */
    #mobile-menu-drawer-wrapper {
      justify-content: flex-end;
      padding: 0;
    }
    #mobile-menu-drawer-wrapper .sheet-content {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      z-index: 2;
      display: flex;
      flex-direction: column;
      transform: translateX(0);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #mobile-menu-drawer-wrapper[hidden] .sheet-content {
      transform: translateX(100%);
    }

    /* Form Fields & Select */
    .form-field select.project-select {
      color: #e0edf8;
      width: 100%;
      min-height: 49px;
      box-shadow: none;
      background: #050505;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      padding: 13px 14px;
      font-size: 14px;
      line-height: 1.5;
      outline: none;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238fbbe1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      background-size: 16px;
    }
    .form-field select.project-select:focus {
      background-color: #0a0a0a;
      border-color: #90c7ff;
      box-shadow: 0 0 0 2px rgba(144, 199, 255, 0.15);
    }
    .form-field select.project-select option {
      background: #0c121c;
      color: #e0edf8;
      padding: 8px 12px;
    }
    .form-feedback {
      margin-top: 14px;
      padding: 10px 14px;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.28);
      color: #fca5a5;
      font-size: 13px;
    }
    .form-feedback a {
      color: #93c5fd;
      text-decoration: underline;
    }
    .field-error {
      color: #f87171;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }

    /* Ambient smoke canvas layer */
    .hero-atmosphere .smoke-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      mix-blend-mode: screen;
      z-index: 4;
    }
  </style>
</head>
<body>
  <div class="studio" id="studio-root" data-motion="full">
    <!-- Cosmic Backdrop: Volumetric Starfield & Centered Glass Watermark -->
    <div class="cosmic-backdrop is-active" aria-hidden="true">
      <div class="ambient-smoke-aura-wrap" aria-hidden="true">
        <div class="ambient-smoke-drift ambient-smoke-drift-1">
          <img src="assets/atmosphere.webp" alt="" draggable="false">
        </div>
        <div class="ambient-smoke-drift ambient-smoke-drift-2">
          <img src="assets/atmosphere.webp" alt="" draggable="false">
        </div>
      </div>
      <canvas class="cosmic-stars-canvas" id="cosmic-canvas"></canvas>
      <div class="cosmic-glass-stage">
        <div class="cosmic-logo-glow"></div>
        <img src="assets/ck-glass-watermark.png" alt="" class="cosmic-glass-logo" draggable="false" loading="lazy">
        <div class="cosmic-glass-overlay"></div>
      </div>
    </div>

    <!-- Reading Progress Bar -->
    <div class="reading-progress" id="reading-progress" aria-hidden="true"><span></span></div>
    <a href="#main-content" class="skip-link">Skip to content</a>

    <!-- Extracted Semantic DOM (Header + Sections) -->
    ${processedMarkup}

    <!-- Project 01 Dialog (Learning Platform) -->
    <div id="project-dialog-1-wrapper" class="studio-modal-portal" hidden>
      <div class="studio-modal-overlay" data-close-dialog></div>
      <div class="studio-modal-container">
        <div class="project-dialog" data-slot="dialog-content" role="dialog" aria-modal="true" aria-labelledby="project-1-title">
          <button type="button" class="studio-modal-close" aria-label="Close dialog" data-close-dialog>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
          <span class="eyebrow">STUDIO CONCEPT / 01</span>
          <h2 id="project-1-title" data-slot="dialog-title">Learning platform</h2>
          <p data-slot="dialog-description">A product study exploring how a learning platform can make the next step obvious. The experience brings courses, lessons, and progress into one calm, accessible workspace.</p>
          <div class="project-preview preview-learning" aria-hidden="true" style="margin: 14px 0 20px;">
            <div class="preview-browser">
              <div class="browser-bar"><span></span><span></span><span></span><small>A space to keep growing</small></div>
              <div class="learning-ui">
                <div class="preview-nav"><span><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M12 5v16"></path><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"></path></svg> Learnspace</span><span class="preview-status-tag"><span class="pulse-dot"></span>Live cohort</span><span>Explore <span class="preview-avatar">A</span></span></div>
                <div class="learning-heading"><small>YOUR NEXT CHAPTER</small><h4>Curiosity is<br>a good beginning.</h4><p>Make a little room for something new.</p></div>
              </div>
            </div>
          </div>
          <h4>What the concept explores</h4>
          <ul class="scope-list">
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Course discovery and enrollment journeys</li>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> A focused lesson and progress experience</li>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Responsive interface and reusable design system</li>
          </ul>
          <h4>The approach</h4>
          <p>Start with the learner’s goals, reduce the steps between finding a course and learning, then build a consistent foundation for mobile and desktop.</p>
          <p class="concept-note">An illustrative CodeKraft studio study, not a published client case study. Technologies show the proposed implementation stack.</p>
          <button type="button" class="button button-primary" data-build-similar="Web Development">Build something like this <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></button>
        </div>
      </div>
    </div>

    <!-- Project 02 Dialog (Operations Workspace) -->
    <div id="project-dialog-2-wrapper" class="studio-modal-portal" hidden>
      <div class="studio-modal-overlay" data-close-dialog></div>
      <div class="studio-modal-container">
        <div class="project-dialog" data-slot="dialog-content" role="dialog" aria-modal="true" aria-labelledby="project-2-title">
          <button type="button" class="studio-modal-close" aria-label="Close dialog" data-close-dialog>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
          <span class="eyebrow">STUDIO CONCEPT / 02</span>
          <h2 id="project-2-title" data-slot="dialog-title">Operations workspace</h2>
          <p data-slot="dialog-description">An interface study for teams managing work across disconnected tools. The concept brings project context, active tasks, and upcoming milestones into a single structured view.</p>
          <div class="project-preview preview-operations" aria-hidden="true" style="margin: 14px 0 20px;">
            <div class="preview-browser">
              <div class="browser-bar"><span></span><span></span><span></span><small>A little more clarity</small></div>
              <div class="operations-ui">
                <aside><span class="op-logo"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg></span></aside>
                <div class="op-main">
                  <div class="op-topline"><span>Workspace / Overview</span><span class="preview-status-tag"><span class="pulse-dot pulse-dot-green"></span>3 pipelines synced</span></div>
                  <div class="op-title"><div><small>MONDAY, SEPTEMBER 7</small><h4>Room to do your best work.</h4></div></div>
                </div>
              </div>
            </div>
          </div>
          <h4>What the concept explores</h4>
          <ul class="scope-list">
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Project overview and task organization</li>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Team priorities and milestone planning</li>
            <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Accessible components and responsive layouts</li>
          </ul>
          <h4>The approach</h4>
          <p>Make status understandable at a glance, keep context close to each action, and give teams a predictable interface as their work grows.</p>
          <p class="concept-note">An illustrative CodeKraft studio study, not a published client case study. Technologies show the proposed implementation stack.</p>
          <button type="button" class="button button-primary" data-build-similar="Software Development">Build something like this <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></button>
        </div>
      </div>
    </div>

    <!-- Contact Dialog (Self-contained, Zero-backend project brief modal) -->
    <div id="contact-dialog-wrapper" class="studio-modal-portal" hidden>
      <div class="studio-modal-overlay" data-close-dialog></div>
      <div class="studio-modal-container">
        <div class="contact-dialog" data-slot="dialog-content" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
          <button type="button" class="studio-modal-close" aria-label="Close dialog" data-close-dialog>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
          <div class="contact-dialog-header">
            <span class="eyebrow"><span></span>PROJECT INQUIRY</span>
            <h2 id="contact-modal-title" data-slot="dialog-title">Let’s Build Something Great.</h2>
            <p data-slot="dialog-description">Tell us about your project, timeline, and goals. We’ll get back to you within 24 hours.</p>
          </div>

          <form class="contact-form" id="studio-contact-form" novalidate aria-label="Start a project">
            <p class="form-required-note">Fields marked * are required.</p>
            <div class="form-row">
              <div class="form-field">
                <label for="contact-name">Name <span>*</span></label>
                <input id="contact-name" name="name" autocomplete="name" required minlength="2" maxlength="100" placeholder="Your name">
                <span id="name-error" class="field-error" hidden></span>
              </div>
              <div class="form-field">
                <label for="contact-email">Email <span>*</span></label>
                <input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@company.com">
                <span id="email-error" class="field-error" hidden></span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="contact-company">Company / Organization <span class="optional">(optional)</span></label>
                <input id="contact-company" name="company" autocomplete="organization" maxlength="160" placeholder="Your company">
              </div>
              <div class="form-field">
                <label for="contact-project-type">Project Type <span>*</span></label>
                <select id="contact-project-type" name="projectType" required class="project-select">
                  <option value="" disabled selected>Select a project type</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Software Development">Software Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="Automation">Automation</option>
                  <option value="Custom Digital Product">Custom Digital Product</option>
                  <option value="Something Else">Something Else</option>
                </select>
                <span id="projectType-error" class="field-error" hidden></span>
              </div>
            </div>
            <div class="form-field">
              <label for="contact-message">Message <span>*</span></label>
              <textarea id="contact-message" name="message" rows="4" required minlength="10" maxlength="5000" placeholder="Tell us what you have in mind. What would you like to build?"></textarea>
              <span id="message-error" class="field-error" hidden></span>
            </div>
            <div class="form-trap" aria-hidden="true" style="display:none">
              <label for="contact-website">Leave this field empty</label>
              <input id="contact-website" name="website" tabindex="-1" autocomplete="off">
            </div>
            <div class="form-bottom">
              <p class="form-note">Your details are used to respond to your project enquiry.</p>
              <button class="button button-primary" type="submit" id="contact-submit-btn">
                <span>Start a Project</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </div>
            <p class="form-feedback" id="form-feedback" role="alert" hidden></p>
          </form>

          <div class="contact-success" id="contact-success-state" role="status" aria-live="polite" hidden>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle2"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
            <span class="eyebrow">BRIEF RECEIVED</span>
            <h3>A great place to start.</h3>
            <p>Thank you. Your project brief has been recorded. You can dispatch it directly via WhatsApp or Email below.</p>
            <span class="brief-reference" id="brief-ref-text"></span>
            <div style="display:flex;gap:12px;margin:18px 0;flex-wrap:wrap;width:100%">
              <a id="whatsapp-direct-link" href="#" target="_blank" rel="noopener noreferrer" class="button button-primary" style="flex:1;min-width:180px;justify-content:center;">
                <span>Send via WhatsApp</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
              </a>
              <a id="email-direct-link" href="#" class="button button-secondary" style="flex:1;min-width:180px;justify-content:center;">
                <span>Send via Email</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
              </a>
            </div>
            <p class="form-note">Studio Direct: <a href="mailto:codekraft.pvt@gmail.com">codekraft.pvt@gmail.com</a> • +91 94007 50981</p>
            <button type="button" class="text-link" id="btn-reset-form">Send another brief <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div id="mobile-menu-drawer-wrapper" class="studio-modal-portal" hidden>
      <div class="studio-modal-overlay" data-close-drawer></div>
      <div class="sheet-content mobile-menu" data-slot="sheet-content" role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <button type="button" class="studio-modal-close" aria-label="Close navigation" data-close-drawer>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
        <a href="#home" class="brand" aria-label="CodeKraft home" data-close-drawer>
          <span class="brand-symbol-wrap" aria-hidden="true">
            <img src="assets/codekraft-emblem.png" width="38" height="38" alt="" class="brand-symbol-img" draggable="false">
          </span>
          <span class="brand-text-wrap" aria-hidden="true">
            <span class="brand-title">CodeKraft</span>
          </span>
        </a>
        <nav aria-label="Mobile navigation links">
          <a href="../" style="color:#38bdf8;font-weight:600"><span>00</span>Showroom &amp; Templates <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>
          <a href="#home" data-close-drawer><span>01</span>Home <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>
          <a href="#services" data-close-drawer><span>02</span>Services <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>
          <a href="#projects" data-close-drawer><span>03</span>Projects <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>
          <a href="#products" data-close-drawer><span>04</span>Products <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>
          <a href="#security" data-close-drawer><span>05</span>Security <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>
          <a href="#about" data-close-drawer><span>06</span>About <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>
          <a href="#contact" data-close-drawer><span>07</span>Contact <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a>
        </nav>
        <div style="margin-top:auto;padding-top:20px;">
          <button type="button" class="button button-primary" style="width:100%" data-open-contact data-close-drawer>Start a Project <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></button>
        </div>
      </div>
    </div>
  </div>

  <script src="studio.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(studioDir, 'index.html'), fullHtml, 'utf8');
console.log('Successfully assembled studio/index.html with full markup and dialog portals.');
