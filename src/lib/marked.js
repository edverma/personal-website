import { marked } from 'marked';

const renderer = new marked.Renderer();

// Override heading renderers
renderer.heading = function(text, level) {
  if (level === 1) {
    return `<h1 style="font-size: 3rem; font-weight: 200; font-style: italic; margin-top: 2.5rem;">${text}</h1>`;
  } else if (level === 2) {
    return `<h2 style="font-size: 3rem; font-weight: 200; font-style: italic; text-align: right; margin-top: 5rem;">${text}</h2>`;
  }
  return `<h${level}>${text}</h${level}>`;
};

// Override paragraph renderer
renderer.paragraph = function(text) {
  return `<p style="margin-top: 2rem; margin-bottom: 2rem; font-size: 1.25rem; ">${text}</p>`;
};

// Override link renderer
renderer.link = function(href, title, text) {
  return `<a style="color: #2563eb;" target="_blank" href="${href}" ${title ? `title="${title}"` : ''}>${text}</a>`;
};

// Override image renderer
renderer.image = function(href, title, text) {
  return `
    <img
      style="width: 80%; height: auto; margin-left: auto; margin-right: auto; margin-top: 5rem; display: block;"
      src="${href}"
      ${title ? `title="${title}"` : ''}
      alt="${text}"
    />
    <p style="font-size: 1rem; margin-top:-1.5rem; color: #6b7280; text-align: center;">${text}</p>
    <div style="margin-bottom:5rem;"></div>
  `;
};

// Override text renderer
renderer.text = function(text) {
  return `
    <span style="font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    margin: 2rem 0; font-weight: 200; letter-spacing: 0.025em; line-height: 1.75;">
      ${text}
    </span>
  `;
};

marked.setOptions({
  renderer: renderer,
});

export default marked;