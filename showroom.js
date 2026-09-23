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

let activeCategory = 'All', savedOnly = false, toastTimer;

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
  const dockCount = $('#dock-saved-count'); if (dockCount) dockCount.textContent = count;
  const drawerCount = $('#drawer-saved-count'); if (drawerCount) drawerCount.textContent = count;

  $$('[data-save]').forEach(button => {
    const isSaved = saved.has(Number(button.dataset.save));
    button.setAttribute('aria-pressed', String(isSaved));
    const item = catalog.find(t => t.id === Number(button.dataset.save));
    if (item) button.setAttribute('aria-label', (isSaved ? 'Remove ' : 'Save ') + item.brand + (isSaved ? ' from selection' : ''));
  });

  const summary = $('#selection-summary');
  if (summary) summary.textContent = saved.size ? 'Also in your selection: ' + catalog.filter(t => saved.has(t.id)).map(t => t.brand).join(', ') : '';
  syncWhatsAppLinks();
}

function filter() {
  const searchInput = $('#template-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  let count = 0;
  $$('.template-card').forEach(card => {
    const show = (activeCategory === 'All' || card.dataset.category === activeCategory) &&
      (!savedOnly || saved.has(Number(card.dataset.id))) &&
      (!query || card.dataset.search.includes(query));
    card.hidden = !show;
    if (show) count++;
  });
  const gallery = $('#gallery');
  if (gallery) gallery.classList.toggle('filtered', activeCategory !== 'All' || savedOnly || !!query);
  const resultCount = $('#result-count');
  if (resultCount) resultCount.textContent = count + ' ' + (count === 1 ? 'concept' : 'concepts') + ' to explore';
  const emptyState = $('#empty-state');
  if (emptyState) emptyState.hidden = count !== 0;
  const labelText = $('#gallery-label-text');
  if (labelText) labelText.textContent = savedOnly ? 'YOUR SELECTION' : activeCategory === 'All' && !query ? 'FEATURED DESIGNS' : 'EXPLORE THE COLLECTION';
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
window.addEventListener('keydown', e => {
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

$$('[data-save]').forEach(button => button.addEventListener('click', () => {
  const id = Number(button.dataset.save);
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

$$('[data-build]').forEach(a => a.addEventListener('click', () => {
  const pt = $('#project-template');
  if (pt) pt.value = a.dataset.build;
  syncWhatsAppLinks();
}));

const pt = $('#project-template');
if (pt) pt.addEventListener('change', syncWhatsAppLinks);

const selected = new URLSearchParams(location.search).get('template');
if (catalog.some(t => String(t.id) === selected)) {
  if (pt) pt.value = selected;
  syncWhatsAppLinks();
}

let lastBrief = '', briefUrl = '';
const talkLink = $('#talk-link');
if (talkLink) {
  if (CONTACT.whatsapp) {
    talkLink.href = 'https://wa.me/' + CONTACT.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(getWhatsAppMessage());
  } else if (CONTACT.email) {
    talkLink.href = 'mailto:' + CONTACT.email;
  }
}

if ($('#project-note')) {
  if (CONTACT.whatsapp) {
    $('#project-note').textContent = 'Prepare your brief and continue the conversation with CodeKraft on WhatsApp.';
  } else if (CONTACT.email) {
    $('#project-note').textContent = 'Prepare your brief and open your email app to send it to CodeKraft.';
  }
}

const projectForm = $('#project-form');
if (projectForm) {
  projectForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const direction = catalog.find(t => String(t.id) === data.get('template'));
    lastBrief = [
      'CODEKRAFT — PROJECT BRIEF',
      '',
      'Name: ' + data.get('name'),
      'Email: ' + data.get('email'),
      'Business: ' + data.get('business'),
      'Design direction: ' + (direction ? direction.brand + ' (' + direction.industry + ')' : 'Help me find my direction'),
      'Saved concepts: ' + catalog.filter(t => saved.has(t.id)).map(t => t.brand).join(', '),
      '',
      'Project goals:',
      data.get('goals')
    ].join('\n');

    if (briefUrl) URL.revokeObjectURL(briefUrl);
    briefUrl = URL.createObjectURL(new Blob([lastBrief], { type: 'text/plain;charset=utf-8' }));
    const result = $('#project-result');
    result.replaceChildren();

    const message = document.createElement('p');
    message.textContent = CONTACT.email || CONTACT.whatsapp ? 'Your project brief is ready. Choose how to share it.' : 'Your project brief is ready to save and share. Nothing has been sent.';
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

// Initial sync on load
syncSelection();
filter();
syncWhatsAppLinks();
