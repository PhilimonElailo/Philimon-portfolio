document.documentElement.classList.add('js');

const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
const desktopLinks = document.querySelectorAll('.desktop-nav a');
const sections = document.querySelectorAll('main section[id]');

function closeMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

function toggleMenu() {
  if (!menuToggle || !mobileMenu) return;
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  mobileMenu.classList.toggle('open', !isOpen);
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
  document.body.classList.toggle('menu-open', !isOpen);
}

menuToggle?.addEventListener('click', toggleMenu);
mobileMenuLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 12);

  let activeId = '';
  const marker = window.scrollY + window.innerHeight * 0.28;
  sections.forEach((section) => {
    if (marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight) {
      activeId = section.id;
    }
  });

  desktopLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const projectGrid = document.getElementById('projectGrid');
const projectState = document.getElementById('projectState');
const filterTabs = document.querySelectorAll('.filter-tab');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const videoModalTitle = document.getElementById('videoModalTitle');

const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_URL !== 'https://YOUR_PROJECT_REF.supabase.co' &&
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
    window.supabase
  );
};
const supabase = isSupabaseConfigured() ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const defaultProjects = [
  {
    id: 'demo-web-1',
    title: 'UCN',
    type: 'web',
    description: 'A clean, community-focused website connecting youth and women to support, programs, and opportunities.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    media_url: '',
    project_url: 'https://philimonelailo.github.io/ucn/',
    display_order: 1
  },
  {
    id: 'demo-web-2',
    title: 'Longech BMU & Fish Market',
    type: 'web',
    description: 'A community-driven portal for beach cleanups, member registration, and a marketplace for local trade.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'],
    media_url: '',
    project_url: 'https://philimonelailo.github.io/Fish-market/',
    display_order: 2
  },
  {
    id: 'demo-video-1',
    title: 'Brand Story Reel',
    type: 'video',
    description: 'A short branded video concept built for storytelling and audience engagement.',
    tags: ['Video Editing', 'Storytelling', 'Social Media'],
    media_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    project_url: '',
    display_order: 3
  }
];

let projectData = [];
let activeFilter = 'all';

function getLocalProjects() {
  try {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (error) {
    console.warn('Unable to read local project cache.', error);
  }

  localStorage.setItem('portfolio_projects', JSON.stringify(defaultProjects));
  return defaultProjects;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getProjectTags(project) {
  if (Array.isArray(project.tags)) return project.tags.filter(Boolean);
  if (!project.tags) return [];
  return String(project.tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function openVideoModal(videoUrl, title) {
  if (!videoModal || !videoPlayer) return;
  videoModal.classList.add('visible');
  videoModal.setAttribute('aria-hidden', 'false');
  videoPlayer.src = videoUrl || '';
  if (videoModalTitle) videoModalTitle.textContent = title || 'Project video';
}

function closeVideoModal() {
  if (!videoModal || !videoPlayer) return;
  videoModal.classList.remove('visible');
  videoModal.setAttribute('aria-hidden', 'true');
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoPlayer.load();
}

function renderProjectCard(project) {
  const tags = getProjectTags(project);
  const tagMarkup = tags.length
    ? tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')
    : '<span>Featured</span>';

  if (project.type === 'video') {
    const poster = project.media_url || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80';
    const projectLink = project.project_url ? `<a href="${encodeURI(project.project_url)}" target="_blank" rel="noopener noreferrer">Watch project <span aria-hidden="true">↗</span></a>` : '';

    return `
      <article class="project-card project-card-video reveal">
        <button class="project-video-trigger" type="button" data-video-url="${escapeHtml(project.media_url || '')}" data-video-title="${escapeHtml(project.title || 'Video Project')}" aria-label="Play ${escapeHtml(project.title || 'video project')}">
          <div class="project-art project-art-video" style="background-image: url('${escapeHtml(poster)}');">
            <span class="video-play-badge" aria-hidden="true">▶</span>
          </div>
        </button>
        <div class="project-details">
          <p class="project-type">Video editing • video</p>
          <h3>${escapeHtml(project.title || 'Untitled project')}</h3>
          <p>${escapeHtml(project.description || 'No description available yet.')}</p>
          <div class="project-stack" aria-label="Project tags">${tagMarkup}</div>
          ${projectLink}
        </div>
      </article>
    `;
  }

  const linkText = project.project_url ? 'Visit project' : 'View project';
  const projectLink = project.project_url ? `<a href="${encodeURI(project.project_url)}" target="_blank" rel="noopener noreferrer">${linkText} <span aria-hidden="true">↗</span></a>` : '<span class="project-link-placeholder">Project link pending</span>';

  return `
    <article class="project-card reveal">
      <div class="project-art project-art-web" aria-hidden="true">
        <span class="art-project-badge">Web</span>
        <span class="art-project-title">${escapeHtml((project.title || 'Project').slice(0, 2).toUpperCase())}</span>
      </div>
      <div class="project-details">
        <p class="project-type">Web development • web</p>
        <h3>${escapeHtml(project.title || 'Untitled project')}</h3>
        <p>${escapeHtml(project.description || 'No description available yet.')}</p>
        <div class="project-stack" aria-label="Project tags">${tagMarkup}</div>
        ${projectLink}
      </div>
    </article>
  `;
}

function renderProjects(projects) {
  if (!projectGrid) return;

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.type === activeFilter;
  });

  if (!filteredProjects.length) {
    projectGrid.innerHTML = '';
    if (projectState) {
      projectState.hidden = false;
      projectState.textContent = 'No projects match this filter yet.';
    }
    return;
  }

  projectGrid.innerHTML = filteredProjects.map(renderProjectCard).join('');
  if (projectState) projectState.hidden = true;

  const videoTriggers = projectGrid.querySelectorAll('[data-video-url]');
  videoTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const mediaUrl = trigger.getAttribute('data-video-url');
      const title = trigger.getAttribute('data-video-title');
      openVideoModal(mediaUrl, title);
    });
  });

  const revealSet = projectGrid.querySelectorAll('.reveal');
  revealSet.forEach((item) => item.classList.add('visible'));
}

async function fetchProjects() {
  if (!isSupabaseConfigured() || !supabase) {
    const localProjects = getLocalProjects();
    projectData = localProjects;
    if (projectState) {
      projectState.hidden = true;
    }
    return projectData;
  }

  const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true });

  if (error) {
    console.error('Failed to load projects:', error);
    const localProjects = getLocalProjects();
    projectData = localProjects;
    if (projectState) {
      projectState.hidden = false;
      projectState.textContent = 'Using local demo content until the Supabase connection is configured.';
    }
    return projectData;
  }

  projectData = data && data.length ? data : getLocalProjects();
  return projectData;
}

async function initProjectGallery() {
  if (!projectGrid) return;

  const projects = await fetchProjects();
  renderProjects(projects);

  filterTabs.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filterTabs.forEach((tab) => tab.classList.toggle('active', tab === button));
      renderProjects(projectData);
    });
  });

  if (videoModal) {
    videoModal.addEventListener('click', (event) => {
      if (event.target.matches('[data-close-video-modal]')) {
        closeVideoModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && videoModal.classList.contains('visible')) {
        closeVideoModal();
      }
    });
  }
}

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const message = formData.get('message').trim();
  const subject = `Freelance enquiry from ${name}`;
  const body = `Hello Philimon,\n\nMy name is ${name}.\nMy email is ${email}.\n\n${message}`;

  if (formNote) formNote.textContent = 'Opening your email app with the message ready to send.';
  window.location.href = `mailto:Philimon.elailo@learnings.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

if (projectGrid) {
  initProjectGallery();
}
