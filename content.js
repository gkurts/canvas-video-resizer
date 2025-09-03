function makeEmbedResizable(embedElement) {
  const container = document.createElement('div');
  container.classList.add('resizable-embed-container');

  // Apply initial size from embed's width/height or style
  container.style.width = embedElement.style.width || embedElement.width + 'px';
  container.style.height = embedElement.style.height || embedElement.height + 'px';
  container.style.position = 'relative';
  container.style.display = 'inline-block';

  embedElement.style.width = '100%';
  embedElement.style.height = '100%';
  embedElement.style.display = 'block';

  embedElement.parentNode.insertBefore(container, embedElement);
  container.appendChild(embedElement);

  const resizer = document.createElement('div');
  resizer.classList.add('resizer');
  Object.assign(resizer.style, {
    width: '16px',
    height: '16px',
    background: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    right: '0',
    bottom: '0',
    cursor: 'nwse-resize',
    borderRadius: '3px'
  });
  container.appendChild(resizer);

  let isResizing = false;

  resizer.addEventListener('mousedown', function (e) {
    e.preventDefault();
    isResizing = true;
    document.body.style.cursor = 'nwse-resize';
  });

  document.addEventListener('mousemove', function (e) {
    if (!isResizing) return;

    const rect = container.getBoundingClientRect();
    const width = e.clientX - rect.left;
    const height = e.clientY - rect.top;

    if (width > 100) container.style.width = width + 'px';   // min width
    if (height > 100) container.style.height = height + 'px'; // min height
  });

  document.addEventListener('mouseup', function () {
    isResizing = false;
    document.body.style.cursor = '';
  });
}

function initResizableEmbeds() {
  const embeds = document.querySelectorAll('.lti-embed-container iframe');
  embeds.forEach(embed => {
    if (!embed.classList.contains('resizable-added')) {
      makeEmbedResizable(embed);
      embed.classList.add('resizable-added');
    }
  });
}

// Observe Canvas content loads
const observer = new MutationObserver(() => {
  initResizableEmbeds();
});

observer.observe(document.body, { childList: true, subtree: true });

