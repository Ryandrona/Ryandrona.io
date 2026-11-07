const filters = document.querySelector('.filters');
const filterButtons = [...filters.querySelectorAll('button')];
const moments = [...document.querySelectorAll('.moment')];
const status = document.querySelector('#filter-status');

filters.hidden = false;
filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;

  const category = button.dataset.filter;
  for (const filter of filterButtons) {
    filter.setAttribute('aria-pressed', String(filter === button));
  }
  for (const moment of moments) {
    moment.hidden = category !== 'all' && moment.dataset.category !== category;
  }
  status.textContent = `${button.textContent}: ${moments.filter((moment) => !moment.hidden).length} ảnh.`;
});

document.querySelector('#year').textContent = new Date().getFullYear();

const lightbox = document.querySelector('#lightbox');
if (typeof lightbox.showModal === 'function') {
  const image = lightbox.querySelector('#lightbox-image');
  const title = lightbox.querySelector('#lightbox-title');
  const count = lightbox.querySelector('#lightbox-count');
  const previous = lightbox.querySelector('[data-prev]');
  const next = lightbox.querySelector('[data-next]');
  let visiblePhotos = [];
  let activeIndex = 0;
  let opener;

  function showPhoto(index) {
    const total = visiblePhotos.length;
    activeIndex = (index + total) % total;
    const link = visiblePhotos[activeIndex];
    image.alt = link.querySelector('img').alt;
    image.src = link.href;
    title.textContent = link.querySelector('h3').textContent;
    count.textContent = `Ảnh ${activeIndex + 1} / ${total}`;
    previous.disabled = next.disabled = total === 1;
  }

  document.querySelector('.gallery').addEventListener('click', (event) => {
    const link = event.target.closest('.photo-link');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    visiblePhotos = moments.filter((moment) => !moment.hidden).map((moment) => moment.querySelector('.photo-link'));
    opener = link;
    showPhoto(visiblePhotos.indexOf(link));
    lightbox.showModal();
  });

  previous.addEventListener('click', () => showPhoto(activeIndex - 1));
  next.addEventListener('click', () => showPhoto(activeIndex + 1));
  lightbox.querySelector('[data-close]').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (visiblePhotos.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showPhoto(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  lightbox.addEventListener('close', () => opener.focus());
}
