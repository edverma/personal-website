import { marked } from 'marked';

// Create a custom renderer
const renderer = new marked.Renderer();

// Override the image method
renderer.image = function (href, title, text) {
    return `
      <br>
      <img
        style="width: 80%; height: auto; display: block; margin-left: auto; margin-right: auto; margin-top: 10px;"
        src="${href}"
        ${title ? `title="${title}"` : ''}
        alt="${text}"
      />
      <p style="font-size: 1rem; color: #6b7280; text-align: center;">${text}</p>
      <br>
    `;
  };
  


// Set the custom renderer
marked.setOptions({
  renderer: renderer,
});

export default marked;