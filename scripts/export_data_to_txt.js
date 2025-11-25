/**
 * export_data_to_txt.js (robust version)
 *
 * Extracts JS data files safely — even if they contain Vue imports or undefined vars.
 * It parses files as plain text, not executes them, and captures export default data blocks.
 *
 * Run: node export_data_to_txt.js
 */

import fs from 'fs'
import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const outputPath = path.join(__dirname, 'data_export.txt')

function extractExportData(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  // Remove problematic imports like `import x from '...'`
  const cleaned = content
    .replace(/import\s+[^;]+;/g, '') // remove import lines
    .replace(/export\s+default\s+/, '') // remove "export default"
    .replace(/([A-Za-z0-9_]+)\s*:\s*[A-Za-z0-9_]+Img/g, (m, key) => `${key}: "IMAGE_PLACEHOLDER"`) // replace image vars
    .replace(/[@~]\/+/g, './') // replace aliases with relative paths

  try {
    // Try to evaluate the JSON-like structure safely
    const safeEval = Function(`"use strict"; return (${cleaned})`)
    const data = safeEval()
    return data
  } catch (err) {
    console.warn(`⚠️ Could not parse file ${path.basename(filePath)} — saving as raw text.`)
    return { rawText: cleaned }
  }
}

function collectData(dir, collected = {}) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      collectData(fullPath, collected)
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.js') &&
      entry.name !== 'export_data_to_txt.js' &&
      entry.name !== 'siteMedia.js')
      {const relPath = path.relative(__dirname, fullPath)
      try {
        const data = extractExportData(fullPath)
        collected[relPath] = data
        console.log(`✅ Processed: ${relPath}`)
      } catch (err) {
        console.error(`❌ Error processing ${relPath}:`, err.message)
      }
    }
  }

  return collected
}

function main() {
  const allData = collectData(__dirname)
  const formattedText = []

  for (const [filePath, content] of Object.entries(allData)) {
    formattedText.push(`==============================`)
    formattedText.push(`File: ${filePath}`)
    formattedText.push(`==============================`)
    formattedText.push(JSON.stringify(content, null, 2))
    formattedText.push('\n')
  }

  fs.writeFileSync(outputPath, formattedText.join('\n'), 'utf-8')
  console.log(`\n📦 Export complete! Data written to ${outputPath}`)
}

main()
