const root = document.documentElement;
const revealItems = document.querySelectorAll('.reveal');
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.site-header nav a')];

function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  root.style.setProperty('--scroll', `${progress}%`);
}

function updateActiveNav() {
  const current = sections
    .map(section => ({ id: section.id, top: Math.abs(section.getBoundingClientRect().top - 120) }))
    .sort((a, b) => a.top - b.top)[0];
  if (!current) return;
  navLinks.forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${current.id}`);
  });
}

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealItems.forEach(item => revealObserver.observe(item));

window.addEventListener('pointermove', event => {
  root.style.setProperty('--mx', `${event.clientX}px`);
  root.style.setProperty('--my', `${event.clientY}px`);
});

window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateActiveNav();
}, { passive: true });

updateScrollProgress();
updateActiveNav();

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.setProperty('--card-x', `${x}px`);
    card.style.setProperty('--card-y', `${y}px`);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy');
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copiado';
      button.classList.add('is-copied');
    } catch (error) {
      button.textContent = 'No se pudo copiar';
    }
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove('is-copied');
    }, 1800);
  });
});
