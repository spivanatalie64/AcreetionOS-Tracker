const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const DOMPurify = require('isomorphic-dompurify');

async function test() {
  const url = "https://www.advocate.com";
  const html = "<html><body><h1>Test</h1><p>Article content</p></body></html>";
  const doc = new JSDOM(html, { url });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  console.log("Readability:", !!article);
  const cleanHtml = DOMPurify.sanitize(article.content, { USE_PROFILES: { html: true } });
  console.log("Purify:", !!cleanHtml);
}
test();
