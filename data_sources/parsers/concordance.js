import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import stripBom from 'strip-bom-stream'
import { fileURLToPath } from 'url'
import sa2 from '../originals/sa2-2023.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputDir = path.join(__dirname, "../originals")
const outputDir = path.join(__dirname, "../outputs")

const filenames = [
  {
    input: "concordances.csv",
  },
]

const mappings = {}

const parse = (inputFilename) => {
  return new Promise((resolve, reject) => {
    const results = {};
    fs.createReadStream(path.join(inputDir, inputFilename))
      .pipe(stripBom())
      .pipe(csv())
      .on("data", (data) => {
        mappings[data.SA22018] = mappings[data.SA22018] || { '2018-sa2': [data.SA22018], '2023-sa2': [] }
        mappings[data.SA22023] = mappings[data.SA22023] || { '2018-sa2': [], '2023-sa2': [data.SA22023] }

        if (data.SA22018 !== '' && !mappings[data.SA22018]['2023-sa2'].includes(data.SA22023)) {
          mappings[data.SA22018]['2023-sa2'].push(data.SA22023)
        }
        if (data.SA22023 !== '' && !mappings[data.SA22023]['2018-sa2'].includes(data.SA22018)) {
          mappings[data.SA22023]['2018-sa2'].push(data.SA22018)
        }
      }).on("end", () => {
        resolve()
      })
  })
}

const init = async () => {
  for (const file of filenames) {
    await parse(file.input)
  }
  console.log(Object.keys(mappings).length, 'concordances parsed')
  fs.writeFileSync(path.join(outputDir, 'concordance.json'), JSON.stringify(mappings, '', 2))
  console.log('wrote', path.join(outputDir, 'concordance.json'))

  const sa2mappings = sa2.features.reduce((acc, cur) => {
    acc[cur.properties.SA22023__2] = cur.properties.SA22023__1
    return acc
  }, {})

  // remaps all the keys to new names
  const getCorrectName = (destination) => {
    return sa2mappings[destination]
  }

  Object.keys(mappings).forEach(key => {
    const twentyThreeName = getCorrectName(key)
    if (twentyThreeName !== undefined && twentyThreeName !== key) {
      // clone the object with the new name
      mappings[twentyThreeName] = mappings[key]
    }
    const zone = mappings[key]
    if (zone['2023-sa2']) zone['2023-sa2'] = zone['2023-sa2'].map(i => getCorrectName(i))
  })
  fs.writeFileSync(path.join(outputDir, 'concordance-friendly.json'), JSON.stringify(mappings, '', 2))
  console.log('wrote', path.join(outputDir, 'concordance-friendly.json'))
}
init()
