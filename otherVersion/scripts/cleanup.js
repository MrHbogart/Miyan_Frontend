#!/usr/bin/env node
/**
 * cleanup.js
 * Safely removes unused image assets and npm packages.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';

// ========== SETTINGS ==========
const ROOT_DIR = process.cwd();
const ASSET_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico'];
const SOURCE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html', '.css', '.scss', '.json'];
// ===============================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, ans => resolve(ans.toLowerCase())));
}

// Recursively get all files from dir
function getAllFiles(dir, exts) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(fullPath);
    }
  }
  return results;
}

// Collect text content of all source files for reference search
function collectSourceText() {
  const files = getAllFiles(ROOT_DIR, SOURCE_EXTENSIONS);
  let combined = '';
  for (const file of files) {
    try {
      combined += fs.readFileSync(file, 'utf8');
    } catch (err) {
      // skip unreadable files
    }
  }
  return combined;
}

// Detect unused assets
function findUnusedAssets() {
  console.log('🔍 Scanning for unused assets...');
  const allAssets = getAllFiles(ROOT_DIR, ASSET_EXTENSIONS);
  const sourceText = collectSourceText();
  const unused = allAssets.filter(f => !sourceText.includes(path.basename(f)));
  return unused;
}

// Detect unused npm packages
function findUnusedPackages() {
  console.log('🔍 Scanning for unused npm packages...');
  try {
    const output = execSync('npx depcheck --json', { encoding: 'utf8' });
    const parsed = JSON.parse(output);
    return parsed.dependencies || [];
  } catch (err) {
    console.warn('⚠️  depcheck not installed or failed to run. Try: npm install -g depcheck');
    return [];
  }
}

async function main() {
  console.log('🧹 Starting cleanup...');
  
  const unusedAssets = findUnusedAssets();
  if (unusedAssets.length) {
    console.log(`\nFound ${unusedAssets.length} unused assets:`);
    unusedAssets.forEach(f => console.log(' - ' + f));
    const ans = await ask('\n❓ Delete these files? (y/n): ');
    if (ans === 'y') {
      unusedAssets.forEach(f => fs.unlinkSync(f));
      console.log('✅ Unused assets deleted.');
    } else {
      console.log('⏩ Skipped asset deletion.');
    }
  } else {
    console.log('🎉 No unused assets found.');
  }

  const unusedPackages = findUnusedPackages();
  if (unusedPackages.length) {
    console.log(`\nFound ${unusedPackages.length} unused npm packages:`);
    unusedPackages.forEach(p => console.log(' - ' + p));
    const ans2 = await ask('\n❓ Remove these packages with npm uninstall? (y/n): ');
    if (ans2 === 'y') {
      execSync(`npm uninstall ${unusedPackages.join(' ')}`, { stdio: 'inherit' });
      console.log('✅ Unused packages removed.');
    } else {
      console.log('⏩ Skipped package removal.');
    }
  } else {
    console.log('🎉 No unused npm packages found.');
  }

  rl.close();
  console.log('\n🧩 Cleanup complete!');
}

main().catch(err => {
  console.error('❌ Error:', err);
  rl.close();
});
