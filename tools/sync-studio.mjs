import fs from 'node:fs';
import path from 'node:path';

const srcBase = 'C:/Users/ASUS/Documents/CodeKraft/Website/CodeKraft-Studio-v5/CodeKraft-Studio';
const targetBase = path.resolve('studio');

console.log('Target studio directory:', targetBase);

// Ensure directories exist
fs.mkdirSync(path.join(targetBase, 'assets'), { recursive: true });
fs.mkdirSync(path.join(targetBase, 'assets/icons'), { recursive: true });
fs.mkdirSync(path.join(targetBase, '_next/static/chunks'), { recursive: true });

// 1. Copy assets from dist/client/assets
const clientAssets = path.join(srcBase, 'dist/client/assets');
if (fs.existsSync(clientAssets)) {
  fs.cpSync(clientAssets, path.join(targetBase, 'assets'), { recursive: true });
  console.log('✓ Copied dist/client/assets');
}

// 2. Copy icons from public/assets/icons
const iconsSrc = path.join(srcBase, 'public/assets/icons');
if (fs.existsSync(iconsSrc)) {
  fs.cpSync(iconsSrc, path.join(targetBase, 'assets/icons'), { recursive: true });
  console.log('✓ Copied icons');
}

// 3. Copy SVG logos from public/
const publicDir = path.join(srcBase, 'public');
const publicFiles = fs.readdirSync(publicDir);
let svgCount = 0;
publicFiles.forEach(f => {
  if (f.endsWith('.svg')) {
    fs.copyFileSync(path.join(publicDir, f), path.join(targetBase, f));
    svgCount++;
  }
});
console.log(`✓ Copied ${svgCount} SVG logos to studio/`);

// 4. Copy CSS from .next/static/chunks
const cssSource = path.join(srcBase, '.next/static/chunks/0~0ab1b2fr7ib.css');
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, path.join(targetBase, 'studio.css'));
  fs.copyFileSync(cssSource, path.join(targetBase, '_next/static/chunks/0~0ab1b2fr7ib.css'));
  console.log('✓ Copied studio.css (211KB)');
}

// 5. Copy all .next/static files to studio/_next/static
const nextStaticSrc = path.join(srcBase, '.next/static');
if (fs.existsSync(nextStaticSrc)) {
  fs.cpSync(nextStaticSrc, path.join(targetBase, '_next/static'), { recursive: true });
  console.log('✓ Copied .next/static bundle');
}

console.log('Sync completed successfully!');
