import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const finalResult = {}

const transformFilename = (name) => {
  return name
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[()\/]/g, '')
}

const splitRegions = () => {
  const data = JSON.parse(
    fs
      .readFileSync(
        path.join(__dirname, '../../', process.argv[2], 'combined-output.json')
      )
      .toString()
  )

  const dataPath = path.join(__dirname, '../../public/data')
  try {
    fs.mkdirSync(dataPath)
  } catch (err) {
    // folder doesn't exist
  }

  const outputPath = path.join(__dirname, '../../public/data/regions')

  try {
    fs.rmSync(outputPath, { recursive: true })
  } catch (err) {
    // folder doesn't exist
  }
  fs.mkdirSync(outputPath)

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
}

splitRegions()
