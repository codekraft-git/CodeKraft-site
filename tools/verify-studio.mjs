import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync('studio/index.html', 'utf8');

const regex = /(?:src|href)="([^"]+)"/g;
let match;
const matches = [];
while ((match = regex.exec(html)) !== null) {
  matches.push(match[1]);
}

console.log('Total links/sources found:', matches.length);

const missing = [];
for (const src of matches) {
  if (src.startsWith('#') || src.startsWith('mailto:') || src.startsWith('https://') || src.startsWith('http://') || src.startsWith('data:')) {
    continue;
  }
  const clean = src.split('?')[0].split('#')[0];
  const fullPath = path.resolve('studio', clean);
  if (!fs.existsSync(fullPath)) {
    missing.push({ src, fullPath });
  }
}

if (missing.length === 0) {
  console.log('SUCCESS: All local assets exist and resolve perfectly!');
} else {
  console.error('Missing assets:', missing);
}
