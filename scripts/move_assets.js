const fs = require('fs');
const path = require('path');

// Config - adjust as needed
const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');
const assetsDir = path.join(projectRoot, 'assets');
const sourceDirs = ['components', 'views', 'pages'];
const sourceExtensions = ['.js', '.ts', '.vue'];

// Regex to find public asset references - inside strings
const assetRegex = /(["'`])\/([^\s"'`]+?\.(png|jpg|jpeg|gif|svg|webp|ico|bmp|avif|mp4|mp3|woff|woff2|ttf|eot))\1/gi;

// Helper: get all source files recursively in srcDir with allowed extensions
function getSourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getSourceFiles(fullPath));
    } else if (sourceExtensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function moveFile(relativePath) {
  const fromPath = path.join(publicDir, relativePath);
  const toPath = path.join(assetsDir, relativePath);
  if (!fs.existsSync(fromPath)) {
    console.warn(`[WARN] Asset file not found in public: ${relativePath}`);
    return false;
  }
  ensureDirExists(path.dirname(toPath));
  fs.renameSync(fromPath, toPath);
  return true;
}

// Convert asset relative path into an import variable name
// e.g. images/logo.png -> logoImage
function toVariableName(assetPath) {
  const base = path.basename(assetPath, path.extname(assetPath));
  // Remove non-alphanumeric and camelCase it
  return base.replace(/[^a-zA-Z0-9]/g, '') + 'Img';
}

// Read a file and return all matches of asset references
function findAssetsInFile(fileContent) {
  const matches = [];
  let m;
  while ((m = assetRegex.exec(fileContent)) !== null) {
    // m[2] is the path without leading slash
    matches.push(m[2]);
  }
  return [...new Set(matches)]; // unique
}

function updateFile(filePath, assetsMoved) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (assetsMoved.length === 0) return false;

  // Collect existing imports to avoid duplicates
  const importRegex = /^import\s+(\w+)\s+from\s+['"](?:~|@)\/assets\/[^'"\n]+['"];?$/gm;
  const existingImports = new Set();
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    existingImports.add(m[1]);
  }

  // We will collect new imports here
  let newImports = '';

  // For each asset, replace string refs with imported variable usage and add import line if not exists
  for (const assetRelPath of assetsMoved) {
    const varName = toVariableName(assetRelPath);
    const assetImportPath = `~/assets/${assetRelPath.replace(/\\/g, '/')}`; // cross-platform fix

    if (!existingImports.has(varName)) {
      newImports += `import ${varName} from '${assetImportPath}';\n`;
      existingImports.add(varName);
    }

    // Replace occurrences of "/path/asset.ext" string with `${varName}`
    // We'll replace in JS parts: "/images/logo.png" → {varName}
    // but for template strings and other contexts, to keep simple replace all exact matches inside quotes with `${varName}`
    const assetStringRegex = new RegExp(`(["'\`])/${assetRelPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`, 'g');
    content = content.replace(assetStringRegex, varName);
  }

  // Insert imports after the last import or at top of file
  const lastImportIndex = content.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    // Find end of last import line
    const afterLastImport = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, afterLastImport + 1) + newImports + content.slice(afterLastImport + 1);
  } else {
    // No imports found - add at top
    content = newImports + '\n' + content;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`[FIXED] Updated asset references in: ${path.relative(projectRoot, filePath)}`);
  return true;
}

function main() {
  console.log('Scanning source files for public asset references...');
  const sourceFiles = sourceDirs
    .map((dir) => path.join(projectRoot, dir))
    .flatMap(getSourceFiles);
  let totalMoved = 0, totalFixed = 0;

  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const assets = findAssetsInFile(content);

    if (assets.length === 0) continue;

    // Move assets and record which were actually moved
    const movedAssets = [];
    for (const assetRelPath of assets) {
      if (moveFile(assetRelPath)) {
        movedAssets.push(assetRelPath);
        totalMoved++;
      }
    }

    // Update source file asset references if any assets moved
    if (movedAssets.length > 0) {
      if (updateFile(filePath, movedAssets)) {
        totalFixed++;
      }
    }
  }

  console.log(`Done. Moved ${totalMoved} assets and updated ${totalFixed} source files.`);
}

main();
