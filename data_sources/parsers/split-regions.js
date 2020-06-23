const fs = require('fs')
const path = require('path')

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
      .readFileSync(path.join(__dirname, '../outputs', 'combined-output.json'))
      .toString()
  )

  const dataPath = path.join(__dirname, '../../dist/data')
  try {
    fs.mkdirSync(dataPath)
  } catch (err) {
    // folder doesn't exist
  }

  const outputPath = path.join(__dirname, '../../dist/data/regions')

  try {
    fs.rmdirSync(outputPath, { recursive: true })
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
        console.log(`written ${filename}.json`)
      }
    )
  })
}

splitRegions()
