#!/usr/bin/env node
/*
  Image preprocessing script
  Usage: node scripts/prep-images.js /path/to/source_dir

  This script will:
  - scan the source directory for images
  - convert HEIC/HEIF and other formats to JPEG and WebP
  - generate three sizes (small, medium, large)
  - write outputs to public/images/{small,medium,large}
  - produce public/images/srcset.json with mapping

  Notes: This uses sharp. Install it with:
    npm install --save-dev sharp

  On macOS you may need libvips with heif support for HEIC files. If sharp cannot decode HEIC, convert them with Photos or a converter first.
*/

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const crypto = require('crypto')

if (process.argv.length < 3) {
  console.error('Usage: node scripts/prep-images.js /path/to/source_dir')
  process.exit(1)
}

const srcDir = path.resolve(process.argv[2])
const outBase = path.resolve(process.cwd(), 'public', 'images')
const sizes = { small: 480, medium: 1024, large: 2048 }

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

ensureDir(outBase)
Object.keys(sizes).forEach(k => ensureDir(path.join(outBase, k)))

const mapping = {}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase()
  const name = path.basename(file, ext)
  const inPath = path.join(srcDir, file)

  try {
    const data = fs.readFileSync(inPath)
    // create a short hash to avoid collisions
    const hash = crypto.createHash('md5').update(data).digest('hex').slice(0, 8)

    for (const [label, width] of Object.entries(sizes)) {
      const outName = `${String(width).padStart(4,'0')}-${name.replace(/[^a-z0-9\-]/gi,'').toLowerCase()}-${hash}.jpg`
      const outPath = path.join(outBase, label, outName)

      await sharp(data)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outPath)

      // also write webp
      const outWebp = outPath.replace(/\.jpg$/, '.webp')
      await sharp(data)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outWebp)

      mapping[file] = mapping[file] || { sizes: {} }
      mapping[file].sizes[label] = {
        jpg: path.relative(path.join(process.cwd(), 'public'), outPath).replace(/\\/g,'/'),
        webp: path.relative(path.join(process.cwd(), 'public'), outWebp).replace(/\\/g,'/')
      }
    }

    console.log('Processed', file)
  } catch (err) {
    console.warn('Skipping', file, '(', err.message, ')')
  }
}

;(async () => {
  const files = fs.readdirSync(srcDir).filter(f => !f.startsWith('.'))
  for (const f of files) {
    await processFile(f)
  }

  fs.writeFileSync(path.join(outBase, 'srcset.json'), JSON.stringify(mapping, null, 2))
  console.log('Done. Outputs are in', outBase)
})()
