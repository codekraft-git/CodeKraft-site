import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'assets/catalog.json'), 'utf8'));

const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.codekraft.online/</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://www.codekraft.online/assets/previews/studio.jpg</image:loc>
      <image:title>CodeKraft — High-Performance Websites &amp; Digital Products</image:title>
      <image:caption>Interactive showcase of premium website concepts and custom software architecture by CodeKraft</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.codekraft.online/studio/</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://www.codekraft.online/assets/previews/studio.jpg</image:loc>
      <image:title>CodeKraft Studio Concept</image:title>
      <image:caption>Modern software and design studio website template</image:caption>
    </image:image>
  </url>
`;

for (const item of catalog) {
  const previewRel = `assets/previews/${item.folder}.jpg`;
  const previewFull = path.join(root, previewRel);
  const hasPreview = fs.existsSync(previewFull);

  xml += `  <url>
    <loc>https://www.codekraft.online/${item.folder}/</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
`;
  if (hasPreview) {
    xml += `    <image:image>
      <image:loc>https://www.codekraft.online/${previewRel}</image:loc>
      <image:title>${esc(item.brand)} — ${esc(item.industry)} Website Concept</image:title>
      <image:caption>${esc(item.description)}</image:caption>
    </image:image>
`;
  }
  xml += `  </url>
`;
}

xml += `</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');
console.log(`Generated sitemap.xml with ${catalog.length + 2} URLs.`);
