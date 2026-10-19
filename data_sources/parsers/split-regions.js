import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { gunzipSync } from 'node:zlib'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const transformFilename = (name) => {
  return name
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[()\/]/g, '')
}

const outputPath = path.join(__dirname, '../../public/data/regions')

try {
  fs.rmSync(outputPath, { recursive: true })
} catch (err) {
  // folder doesn't exist
}
fs.mkdirSync(outputPath, { recursive: true })

const splitRegions = (filename) => {
  const file = fs.readFileSync(filename)
  let fileString = ''
  if (filename.endsWith('.gz')) {
    fileString = gunzipSync(file)
  } else {
    fileString = file.toString()
  }
  const data = JSON.parse(fileString)

  Object.keys(data).forEach((key) => {
    const filename = transformFilename(key)
    fs.writeFile(
      path.join(outputPath, `${filename}.json`),
      JSON.stringify(data[key], '', 2),
      (err) => {
        if (err) throw err
        // console.log(`written ${filename}.json`)
      }
    )
  })
  console.log('wrote', Object.keys(data).length, 'files')
}

const files = fs.readdirSync(path.join(__dirname, '../../', process.argv[2]))

files
  .filter(
    (file) => file.endsWith('-output.json.gz') || file.endsWith('-output.json')
  )
  .forEach((file) => {
    splitRegions(path.join(__dirname, '../../', process.argv[2], file))
  })
