const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const largeDir = path.join(repoRoot, 'public', 'images', 'large');
const mediumDir = path.join(repoRoot, 'public', 'images', 'medium');

function listJpgFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
}

const sourceFiles = listJpgFiles(largeDir);
if (sourceFiles.length === 0) {
  console.error('No source images found in', largeDir);
  process.exit(1);
}

// Menu files to process and their prefix names for output
const menus = [
  { file: path.join(repoRoot, 'src', 'data', 'menus', 'bereshtMenu.js'), prefix: 'menu-beresht' },
  { file: path.join(repoRoot, 'src', 'data', 'menus', 'bereshtTodayMenu.js'), prefix: 'menu-beresht-today' },
  { file: path.join(repoRoot, 'src', 'data', 'menus', 'madiMenu.js'), prefix: 'menu-madi' },
  { file: path.join(repoRoot, 'src', 'data', 'menus', 'madiTodayMenu.js'), prefix: 'menu-madi-today' }
];

let srcIndex = 0;

menus.forEach(menu => {
  if (!fs.existsSync(menu.file)) {
    console.warn('Menu file not found:', menu.file);
    return;
  }
  let content = fs.readFileSync(menu.file, 'utf8');

  // find all occurrences of image: '...'
  const regex = /image:\s*'[^']*'/g;
  const matches = content.match(regex) || [];
  let counter = 1;
  let newContent = content.replace(regex, (m) => {
    const ext = '.jpg';
    const newName = `${menu.prefix}-${counter}${ext}`;
    const newPath = `/images/medium/${newName}`;

    // copy a source image into mediumDir with newName
    const srcFile = sourceFiles[srcIndex % sourceFiles.length];
    const srcPath = path.join(largeDir, srcFile);
    const destPath = path.join(mediumDir, newName);
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log('Copied', srcFile, '->', newName);
    } catch (err) {
      console.error('Failed to copy', srcPath, '->', destPath, err);
    }

    srcIndex += 1;
    counter += 1;

    return `image: '${newPath}'`;
  });

  fs.writeFileSync(menu.file, newContent, 'utf8');
  console.log('Updated', menu.file, 'with', counter - 1, 'images');
});

console.log('Done.');
