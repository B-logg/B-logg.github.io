(() => {
  const root = document.querySelector('[data-projects]');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('[data-project-card]'));
  const filters = root.querySelector('[data-project-filters]');
  const status = root.querySelector('[data-project-count]');
  if (!filters || !status || cards.length === 0) return;

  const topics = new Map(cards.map(card => {
    const tags = JSON.parse(card.dataset.tags || '[]');
    return [card, Array.isArray(tags) ? tags : []];
  }));
  const tags = Array.from(new Set(Array.from(topics.values()).flat())).sort();
  const options = [{ label: 'All', tag: null }, ...tags.map(tag => ({ label: tag, tag }))];

  function select(selected) {
    let visible = 0;
    cards.forEach(card => {
      card.hidden = selected !== null && !topics.get(card).includes(selected);
      if (!card.hidden) visible += 1;
    });
    Array.from(filters.children).forEach((button, index) => {
      button.setAttribute('aria-pressed', String(options[index].tag === selected));
    });
    status.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
  }

  options.forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option.label;
    button.addEventListener('click', () => select(option.tag));
    filters.appendChild(button);
  });
  filters.hidden = false;
  status.hidden = false;
  select(null);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateMotion = () => {
    root.querySelectorAll('video').forEach(video => {
      if (reducedMotion.matches) video.pause();
      else video.play().catch(() => {});
    });
  };
  reducedMotion.addEventListener('change', updateMotion);
  updateMotion();
})();
