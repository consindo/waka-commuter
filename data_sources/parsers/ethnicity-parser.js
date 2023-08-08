import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import stripBom from 'strip-bom-stream'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filenames = [
  {
    input: 'ethnicity.csv',
    output: 'ethnicity.json',
  },
]

// our parser
const parse = (inputFilename, outputFilename) => {
  const results = {}
  fs.createReadStream(inputFilename)
    .pipe(stripBom())
    .pipe(csv())
    .on('data', (data) => {
      // doing a big aggregate
      if (results[data['Area'].trim()] === undefined) {
        results[data['Area'].trim()] = {}
      }

      let key = data['Ethnic group']

      // because in the data set it's "Total people - main means of travel to education/work"
      if (key.includes('Total')) {
        key = 'Total'
      }

      results[data['Area'].trim()][key] = parseInt(data['Value'], 10)
    })
    .on('end', () => {
      fs.writeFileSync(outputFilename, JSON.stringify(results, '', 2))
      console.log(`Converted ${inputFilename} into ${outputFilename}`)
    })
}

// run the code
filenames.forEach((filename) =>
  parse(
    path.join(__dirname, '../originals', filename.input),
    path.join(__dirname, '../outputs', filename.output)
  )
)
