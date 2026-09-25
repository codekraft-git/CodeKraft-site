// CodeKraft official contact destinations
const CONTACT = { email: 'codekraft.pvt@gmail.com', whatsapp: '+919400750981', phone: '+919400750981' };
const catalog = JSON.parse(document.getElementById('catalog-data').textContent);
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const storageKey = 'codekraft-selection-v1';

let saved = new Set();
try {
  const values = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(values)) saved = new Set(values.filter(id => catalog.some(t => t.id === id)));
} catch {}

let activeCategory = 'All', savedOnly = false, isGalleryExpanded = false, toastTimer;
let currentModalIndex = 0;

function toast(message) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('visible'), 2500);
}

function getWhatsAppMessage() {
  const val = $('#project-template') ? $('#project-template').value : '';
  const dir = catalog.find(t => String(t.id) === val);
  if (dir) return `Hello CodeKraft! I'm interested in building a website based on your "${dir.brand}" concept (${dir.industry}). I'd love to discuss details with your team.`;
  if (saved.size > 0) {
    const names = catalog.filter(t => saved.has(t.id)).map(t => t.brand).join(', ');
    return `Hello CodeKraft! I've been exploring your website concepts (${names}) and would like to discuss building a website for my business.`;
  }
  return "Hello CodeKraft! I'm interested in discussing a website / digital product for my business. I'd love to discuss details with your team.";
}

function syncWhatsAppLinks() {
  const msg = getWhatsAppMessage();
  const num = CONTACT.whatsapp.replace(/\D/g, '');
  const url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg);
  const pill = $('#whatsapp-contact'); if (pill) pill.href = url;
  const foot = $('#footer-whatsapp'); if (foot) foot.href = url;
  const dock = $('#dock-whatsapp'); if (dock) dock.href = url;
  const drawer = $('#drawer-wa-link'); if (drawer) drawer.href = url;
}

function syncSelection() {
  try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch {}
  const count = String(saved.size);
  const headerCount = $('#saved-count'); if (headerCount) headerCount.textContent = count;
  const dockCount = $('#dock-saved-count');
  if (dockCount) {
    dockCount.textContent = count;
    dockCount.classList.add('bump');
    setTimeout(() => dockCount.classList.remove('bump'), 300);
  }
  const drawerCount = $('#drawer-saved-count'); if (drawerCount) drawerCount.textContent = count;

  $$('[data-save]').forEach(button => {
    const isSaved = saved.has(Number(button.dataset.save));
    button.setAttribute('aria-pressed', String(isSaved));
    const item = catalog.find(t => t.id === Number(button.dataset.save));
    if (item) button.setAttribute('aria-label', (isSaved ? 'Remove ' : 'Save ') + item.brand + (isSaved ? ' from selection' : ''));
  });

  const modalSaveBtn = $('#modal-save-btn');
  if (modalSaveBtn) {
    const curItem = catalog[currentModalIndex];
    if (curItem) {
      const isSaved = saved.has(curItem.id);
      modalSaveBtn.setAttribute('aria-pressed', String(isSaved));
      const modalSaveText = $('#modal-save-text');
      if (modalSaveText) modalSaveText.textContent = isSaved ? 'Saved in Favorites' : 'Save to Favorites';
    }
  }

  const summary = $('#selection-summary');
  if (summary) summary.textContent = saved.size ? 'Saved in your selection: ' + catalog.filter(t => saved.has(t.id)).map(t => t.brand).join(', ') : '';
  syncWhatsAppLinks();
}

function filter() {
  const searchInput = $('#template-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const isFiltering = activeCategory !== 'All' || savedOnly || !!query;
  const gallery = $('#gallery');
  const expandBar = $('#gallery-expand-bar');

  let visibleCount = 0;
  $$('.template-card').forEach((card, index) => {
    const matchesFilter = (activeCategory === 'All' || card.dataset.category === activeCategory) &&
      (!savedOnly || saved.has(Number(card.dataset.id))) &&
      (!query || card.dataset.search.includes(query));

    if (!matchesFilter) {
      card.hidden = true;
    } else {
      card.hidden = false;
      visibleCount++;
    }
  });

  // Handle collapsed / expanded state
  if (gallery) {
    if (isFiltering) {
      gallery.classList.remove('is-collapsed');
      if (expandBar) expandBar.hidden = true;
    } else {
      gallery.classList.toggle('is-collapsed', !isGalleryExpanded);
      if (expandBar) expandBar.hidden = false;
    }
  }

  const resultCount = $('#result-count');
  if (resultCount) {
    const shown = isFiltering || isGalleryExpanded ? visibleCount : Math.min(6, visibleCount);
    resultCount.textContent = `${shown} of ${visibleCount} concepts`;
  }

  const emptyState = $('#empty-state');
  if (emptyState) emptyState.hidden = visibleCount !== 0;

  const labelText = $('#gallery-label-text');
  if (labelText) {
    labelText.textContent = savedOnly ? 'YOUR SELECTION' : isFiltering ? 'FILTERED CONCEPTS' : 'EXPLORE CONCEPTS';
  }

  const selNav = $('#selection-nav');
  if (selNav) selNav.setAttribute('aria-pressed', String(savedOnly));
}

function toggleSavedView() {
  savedOnly = !savedOnly;
  activeCategory = 'All';
  const searchInput = $('#template-search');
  if (searchInput) searchInput.value = '';
  $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'All')));
  filter();
  const collection = $('#collection');
  if (collection) collection.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

// Expand / Collapse Gallery Logic
const expandBtn = $('#btn-expand-gallery');
if (expandBtn) {
  expandBtn.addEventListener('click', () => {
    isGalleryExpanded = !isGalleryExpanded;
    expandBtn.setAttribute('aria-expanded', String(isGalleryExpanded));
    const btnText = expandBtn.querySelector('.btn-expand-text');
    const btnBadge = expandBtn.querySelector('.btn-expand-badge');
    if (isGalleryExpanded) {
      if (btnText) btnText.textContent = 'Show Less';
      if (btnBadge) btnBadge.textContent = `${catalog.length} Visible`;
    } else {
      if (btnText) btnText.textContent = 'Explore All Concepts';
      if (btnBadge) btnBadge.textContent = `+${catalog.length - 6} More`;
      const collection = $('#collection');
      if (collection) collection.scrollIntoView({ behavior: 'smooth' });
    }
    filter();
  });
}

// Concept Browser Window (Modal)
const modal = $('#concept-modal');
const modalBackdrop = $('#modal-backdrop');
const modalCloseBtn = $('#modal-close-btn');
const modalTrafficClose = $('#modal-traffic-close');
const modalTrafficMax = $('#modal-traffic-max');
const modalPrevBtn = $('#modal-prev-btn');
const modalNextBtn = $('#modal-next-btn');
const modalBuildBtn = $('#modal-build-btn');
const modalSaveBtn = $('#modal-save-btn');
const openCatalogWindowBtn = $('#btn-open-catalog-window');
const modalViewportContainer = $('#modal-viewport-container');

function updateModalContent(index) {
  if (index < 0) index = catalog.length - 1;
  if (index >= catalog.length) index = 0;
  currentModalIndex = index;
  const item = catalog[index];
  if (!item) return;

  const titleEl = $('#modal-window-title'); if (titleEl) titleEl.textContent = item.brand;
  const brandEl = $('#modal-brand'); if (brandEl) brandEl.textContent = item.brand;
  const imgEl = $('#modal-preview-img'); if (imgEl) imgEl.src = `assets/previews/${item.folder}.jpg`;
  const indexBadge = $('#modal-index-badge'); if (indexBadge) indexBadge.textContent = `${String(item.id).padStart(2,'0')} / ${catalog.length}`;
  const catBadge = $('#modal-category-badge'); if (catBadge) catBadge.textContent = item.category;
  const indEl = $('#modal-industry'); if (indEl) indEl.textContent = item.industry;
  const descEl = $('#modal-desc'); if (descEl) descEl.textContent = item.description;
  const mobileCounter = $('#modal-counter-mobile'); if (mobileCounter) mobileCounter.textContent = `${String(item.id).padStart(2,'0')} / ${catalog.length}`;
  const liveBtn = $('#modal-open-live-btn'); if (liveBtn) liveBtn.href = `${item.folder}/`;

  // Update dots
  const dotsContainer = $('#modal-dots-indicator');
  if (dotsContainer) {
    dotsContainer.replaceChildren();
    catalog.forEach((t, i) => {
      const dot = document.createElement('button');
      dot.className = 'modal-dot' + (i === index ? ' active' : '');
      dot.setAttribute('aria-label', `View concept ${t.brand}`);
      dot.addEventListener('click', () => updateModalContent(i));
      dotsContainer.append(dot);
    });
  }

  // Update save button in modal
  if (modalSaveBtn) {
    const isSaved = saved.has(item.id);
    modalSaveBtn.setAttribute('aria-pressed', String(isSaved));
    const modalSaveText = $('#modal-save-text');
    if (modalSaveText) modalSaveText.textContent = isSaved ? 'Saved in Favorites' : 'Save to Favorites';
  }
}

function openConceptModal(id = 1) {
  const idx = catalog.findIndex(t => t.id === Number(id));
  updateModalContent(idx !== -1 ? idx : 0);
  if (modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
  }
}

function closeConceptModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
}

if (openCatalogWindowBtn) {
  openCatalogWindowBtn.addEventListener('click', () => openConceptModal(1));
}
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeConceptModal);
if (modalTrafficClose) modalTrafficClose.addEventListener('click', closeConceptModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeConceptModal);

if (modalTrafficMax) {
  modalTrafficMax.addEventListener('click', () => {
    const w = $('.modal-window');
    if (w) w.classList.toggle('is-fullscreen');
  });
}

if (modalPrevBtn) modalPrevBtn.addEventListener('click', () => updateModalContent(currentModalIndex - 1));
if (modalNextBtn) modalNextBtn.addEventListener('click', () => updateModalContent(currentModalIndex + 1));

// Viewport switcher in modal
$$('.viewport-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.viewport-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const vp = btn.dataset.viewport;
    if (modalViewportContainer) {
      modalViewportContainer.className = `modal-viewport-container viewport-${vp}`;
    }
  });
});

// Modal Build CTA
if (modalBuildBtn) {
  modalBuildBtn.addEventListener('click', () => {
    const item = catalog[currentModalIndex];
    if (item) {
      closeConceptModal();
      selectConceptForBuild(item.id);
    }
  });
}

// Modal Save CTA
if (modalSaveBtn) {
  modalSaveBtn.addEventListener('click', () => {
    const item = catalog[currentModalIndex];
    if (!item) return;
    if (saved.has(item.id)) {
      saved.delete(item.id);
      toast('Removed from favorites');
    } else {
      saved.add(item.id);
      toast('Saved to favorites');
    }
    syncSelection();
    filter();
  });
}

// Intercept all template clicks so that clicking ANY template first opens the Quick View window
document.addEventListener('click', e => {
  // If click is inside the modal itself, let normal actions work (e.g. "Explore Live Website", "Build with This Concept", close, dots)
  if (e.target.closest('#concept-modal')) {
    return;
  }

  // If clicking favorite button, build CTA button, or chip clear, do not open modal
  if (e.target.closest('.favorite') || e.target.closest('[data-save]') || e.target.closest('[data-build]') || e.target.closest('#chip-clear-btn')) {
    return;
  }

  // Check if click is on a hero preview tile
  const heroTile = e.target.closest('.hero-tile');
  if (heroTile) {
    e.preventDefault();
    e.stopPropagation();
    const id = heroTile.dataset.modalId || (heroTile.href ? heroTile.href.match(/(\d+)/)?.[1] : 1);
    openConceptModal(id);
    return;
  }

  // Check if click is on or within a template card
  const card = e.target.closest('.template-card');
  if (card && card.dataset.id) {
    e.preventDefault();
    e.stopPropagation();
    openConceptModal(card.dataset.id);
    return;
  }
}, true);

// Select Concept For Project Form (Replaces Design Direction dropdown)
function selectConceptForBuild(id) {
  const item = catalog.find(t => t.id === Number(id));
  if (!item) return;
  const pt = $('#project-template');
  if (pt) pt.value = item.id;

  const chip = $('#selected-concept-chip');
  if (chip) {
    const nameEl = $('#chip-name'); if (nameEl) nameEl.textContent = item.brand;
    const indEl = $('#chip-industry'); if (indEl) indEl.textContent = `(${item.industry})`;
    chip.hidden = false;
  }
  syncWhatsAppLinks();

  const projectSection = $('#project');
  if (projectSection) {
    projectSection.scrollIntoView({ behavior: 'smooth' });
    const form = $('#project-form');
    if (form) {
      form.classList.add('highlight-pulse');
      setTimeout(() => form.classList.remove('highlight-pulse'), 1400);
    }
  }
}

const chipClearBtn = $('#chip-clear-btn');
if (chipClearBtn) {
  chipClearBtn.addEventListener('click', () => {
    const pt = $('#project-template');
    if (pt) pt.value = '';
    const chip = $('#selected-concept-chip');
    if (chip) chip.hidden = true;
    syncWhatsAppLinks();
  });
}

// Drawer Interactions
const drawer = $('#mobile-drawer');
const menuToggle = $('#mobile-menu-toggle');
const drawerClose = $('#drawer-close');
const drawerBackdrop = $('#drawer-backdrop');

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  if (menuToggle) {
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  document.body.classList.add('drawer-open');
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  if (menuToggle) {
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  document.body.classList.remove('drawer-open');
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
}
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

// Global Keyboard Navigation
window.addEventListener('keydown', e => {
  if (modal && modal.classList.contains('is-open')) {
    if (e.key === 'Escape') closeConceptModal();
    if (e.key === 'ArrowLeft') updateModalContent(currentModalIndex - 1);
    if (e.key === 'ArrowRight') updateModalContent(currentModalIndex + 1);
    return;
  }
  if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeDrawer();
});

$$('.drawer-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// Selection navigation listeners
const selNav = $('#selection-nav');
if (selNav) selNav.addEventListener('click', toggleSavedView);
const dockSavedBtn = $('#dock-saved-btn');
if (dockSavedBtn) dockSavedBtn.addEventListener('click', toggleSavedView);
const drawerSavedBtn = $('#drawer-selection-btn');
if (drawerSavedBtn) {
  drawerSavedBtn.addEventListener('click', () => {
    closeDrawer();
    toggleSavedView();
  });
}

$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.filter;
  $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  filter();
}));

const searchEl = $('#template-search');
if (searchEl) searchEl.addEventListener('input', filter);

// Favorite Heart button with pop micro-animation
$$('[data-save]').forEach(button => button.addEventListener('click', (e) => {
  e.stopPropagation();
  const id = Number(button.dataset.save);
  button.classList.add('pop');
  setTimeout(() => button.classList.remove('pop'), 400);

  if (saved.has(id)) {
    saved.delete(id);
    toast('Removed from your selection');
  } else {
    saved.add(id);
    toast('Added to your selection');
  }
  syncSelection();
  filter();
}));

const resetBtn = $('#reset-filters');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    activeCategory = 'All';
    savedOnly = false;
    if (searchEl) searchEl.value = '';
    $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'All')));
    filter();
  });
}

// "Build this website +" button on cards
document.addEventListener('click', e => {
  const buildBtn = e.target.closest('[data-build]');
  if (buildBtn) {
    e.preventDefault();
    selectConceptForBuild(buildBtn.dataset.build);
  }
});

// Project Form Submission Handler
let lastBrief = '', briefUrl = '';
const projectForm = $('#project-form');
if (projectForm) {
  projectForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const templateId = data.get('template') || ($('#project-template') ? $('#project-template').value : '');
    const direction = catalog.find(t => String(t.id) === String(templateId));

    const briefLines = [
      'CODEKRAFT — PROJECT BRIEF',
      '',
      'Name: ' + data.get('name'),
      'Email: ' + data.get('email'),
      'Business: ' + data.get('business')
    ];

    if (direction) {
      briefLines.push('Chosen direction: ' + direction.brand + ' (' + direction.industry + ')');
    }
    if (saved.size > 0) {
      briefLines.push('Saved concepts: ' + catalog.filter(t => saved.has(t.id)).map(t => t.brand).join(', '));
    }
    briefLines.push('', 'Project goals:', data.get('goals'));

    lastBrief = briefLines.join('\n');

    if (briefUrl) URL.revokeObjectURL(briefUrl);
    briefUrl = URL.createObjectURL(new Blob([lastBrief], { type: 'text/plain;charset=utf-8' }));
    const result = $('#project-result');
    result.replaceChildren();

    const message = document.createElement('p');
    message.textContent = 'Your project brief is ready. Choose how to share it with CodeKraft:';
    result.append(message);

    const download = document.createElement('a');
    download.href = briefUrl;
    download.download = 'CodeKraft-project-brief.txt';
    download.textContent = 'Download brief ↓';
    result.append(download);

    const copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = 'Copy brief';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(lastBrief);
        toast('Project brief copied');
      } catch {
        const box = document.createElement('textarea');
        box.value = lastBrief;
        result.append(box);
        box.focus();
        box.select();
        toast('Select and copy your brief below');
      }
    });
    result.append(copy);

    if (CONTACT.email) {
      const email = document.createElement('a');
      email.href = 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent('New CodeKraft project — ' + data.get('business')) + '&body=' + encodeURIComponent(lastBrief);
      email.textContent = 'Send by email ↗';
      result.append(email);
    }
    if (CONTACT.whatsapp) {
      const wa = document.createElement('a');
      wa.href = 'https://wa.me/' + CONTACT.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(lastBrief);
      wa.target = '_blank';
      wa.rel = 'noopener';
      wa.textContent = 'Share on WhatsApp ↗';
      result.append(wa);
    }
    if (CONTACT.phone) {
      const call = document.createElement('a');
      call.href = 'tel:' + CONTACT.phone;
      call.textContent = 'Call CodeKraft ↗';
      result.append(call);
    }
    result.focus();
  });
}

// Interactive Animations: Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });

$$('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

// Reveal elements currently visible on load / fallback
setTimeout(() => {
  $$('.reveal-on-scroll:not(.is-revealed)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 150) {
      el.classList.add('is-revealed');
    }
  });
}, 300);

// Interactive 3D Hero Parallax (Desktop)
const hero = $('.hero');
const heroComp = $('.hero-composition');
if (hero && heroComp && window.matchMedia('(min-width: 900px)').matches) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroComp.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    heroComp.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
  });
}

// Spotlight Glow on Mousemove for Cards
document.addEventListener('mousemove', e => {
  const card = e.target.closest('.template-card, .service-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
});

// Animated Proof Number Counter in Hero
const proofNum = $('.proof-number');
if (proofNum) {
  let counted = false;
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        const target = catalog.length;
        const duration = 1200;
        let startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          proofNum.textContent = Math.floor(easeOut * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            proofNum.textContent = target;
          }
        }
        requestAnimationFrame(step);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  countObserver.observe(proofNum);
}

// ==========================================================================
// TextLoop Component (Motion Primitives 3D Variant Transitions)
// Initial: { y: 20, rotateX: 90, opacity: 0, filter: blur(4px) }
// Animate: { y: 0, rotateX: 0, opacity: 1, filter: blur(0px) }
// Exit:    { y: -20, rotateX: -90, opacity: 0, filter: blur(4px) }
// ==========================================================================
function initAllTextLoops() {
  const loops = document.querySelectorAll('.text-loop');
  loops.forEach(loop => {
    const items = Array.from(loop.querySelectorAll('.text-loop-item'));
    if (items.length <= 1) return;

    let currentIndex = items.findIndex(el => el.classList.contains('is-active'));
    if (currentIndex < 0) {
      currentIndex = 0;
      items[0].classList.add('is-active');
    }

    function updateTrackWidth(index) {
      const activeEl = items[index];
      if (activeEl) {
        const spacer = loop.querySelector('.text-loop-spacer');
        if (spacer) {
          spacer.textContent = activeEl.textContent.trim();
        }
        const width = activeEl.offsetWidth || activeEl.getBoundingClientRect().width;
        if (width > 0) {
          loop.style.width = `${Math.ceil(width)}px`;
        }
      }
    }

    // Set initial width
    updateTrackWidth(currentIndex);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => updateTrackWidth(currentIndex));
    }
    window.addEventListener('resize', () => updateTrackWidth(currentIndex));

    // Transition cycle every 2400ms
    setInterval(() => {
      if (document.hidden) return;

      const prevIndex = currentIndex;
      currentIndex = (currentIndex + 1) % items.length;

      const prevItem = items[prevIndex];
      const nextItem = items[currentIndex];

      // Previous item exits with { y: -20, rotateX: -90, opacity: 0, filter: blur(4px) }
      prevItem.classList.remove('is-active');
      prevItem.classList.add('is-exit');

      // Next item enters with { y: 0, rotateX: 0, opacity: 1, filter: blur(0px) }
      nextItem.classList.remove('is-exit');
      nextItem.classList.add('is-active');

      // Update container width smoothly
      updateTrackWidth(currentIndex);

      // Clean up exit class after CSS transition completes
      setTimeout(() => {
        prevItem.classList.remove('is-exit');
      }, 450);
    }, 2400);
  });
}

// ==========================================================================
// InfiniteSlider Component (Motion Primitives speedOnHover & gap)
// ==========================================================================
function initInfiniteSliders() {
  const wrappers = document.querySelectorAll('.infinite-slider-wrapper');
  if (!wrappers.length) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) return;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 800);

  wrappers.forEach(wrapper => {
    const track = wrapper.querySelector('.infinite-slider-track');
    if (!track) return;

    if (isTouchDevice) {
      // Mobile / touch devices: Pure CSS GPU keyframe animation is compositor-driven.
      // It never drops frames during touch gestures, doesn't halt during scroll, and uses zero JS timers.
      track.style.animationPlayState = 'running';
      wrapper.addEventListener('touchstart', () => {
        track.style.animationPlayState = 'paused';
      }, { passive: true });
      wrapper.addEventListener('touchend', () => {
        track.style.animationPlayState = 'running';
      }, { passive: true });
      return;
    }

    // Desktop pointer devices: Motion Primitives lerp hover speed engine
    track.style.animation = 'none';

    const baseSpeed = parseFloat(wrapper.dataset.speed || '0.85');
    const hoverSpeed = parseFloat(wrapper.dataset.hoverSpeed || '0.2');
    const isReverse = track.classList.contains('reverse');

    let currentSpeed = baseSpeed;
    let targetSpeed = baseSpeed;
    let pos = 0;
    let animId = null;

    wrapper.addEventListener('mouseenter', () => { targetSpeed = hoverSpeed; });
    wrapper.addEventListener('mouseleave', () => { targetSpeed = baseSpeed; });

    function tick() {
      if (document.hidden) {
        animId = requestAnimationFrame(tick);
        return;
      }

      currentSpeed += (targetSpeed - currentSpeed) * 0.08;
      const halfWidth = track.scrollWidth / 2;

      if (halfWidth > 0) {
        if (isReverse) {
          pos += currentSpeed;
          if (pos >= 0) pos -= halfWidth;
        } else {
          pos -= currentSpeed;
          if (Math.abs(pos) >= halfWidth) pos += halfWidth;
        }
        track.style.transform = `translate3d(${pos.toFixed(2)}px, 0, 0)`;
      }

      animId = requestAnimationFrame(tick);
    }

    // Wait for initial reflow
    requestAnimationFrame(() => {
      pos = isReverse ? -track.scrollWidth / 2 : 0;
      animId = requestAnimationFrame(tick);
    });
  });
}

// Initial sync on load
syncSelection();
filter();
syncWhatsAppLinks();
initAllTextLoops();
initInfiniteSliders();
// URL param check to auto-open quick view or brief selection
const urlParams = new URLSearchParams(window.location.search);
const templateParam = urlParams.get('template') || urlParams.get('preview');
if (templateParam) {
  if (window.location.hash === '#project') {
    selectConceptForBuild(templateParam);
  } else {
    openConceptModal(templateParam);
  }
}
