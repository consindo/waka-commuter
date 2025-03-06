import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import stripBom from 'strip-bom-stream'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filenames = [
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-area-to-area.json',
    year: '2018',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-area-to-area.json',
    year: '2018',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-area-to-area.json',
    year: '2023',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-area-to-area.json',
    year: '2023',
  },
]

// our parser
const parse = (inputFilename, outputFilename, year) => {
  const results = {}
  fs.createReadStream(inputFilename)
    .pipe(stripBom())
    .pipe(csv())
    .on('data', (data) => {
      const homeAddress = data['SA22023_V1_00_NAME_usual_residence_address'].trim()
      const workAddress = (
        data['SA22023_V1_00_NAME_workplace_address'] ||
        data['SA22023_V1_00_NAME_educational_institution_address']
      ).trim()
      const total = parseInt(data[`${year}_Total_stated`], 10)
      if (total < 0) return

      if (results[homeAddress] === undefined) {
        results[homeAddress] = {
          departTo: {},
          arriveFrom: {},
        }
      }
      if (results[workAddress] === undefined) {
        results[workAddress] = {
          departTo: {},
          arriveFrom: {},
        }
      }

      // put a reference from residence to workplace
      results[homeAddress].departTo[workAddress] = total

      // and a reference from workplace to residence
      results[workAddress].arriveFrom[homeAddress] = total
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
    path.join(__dirname, '../outputs', filename.output),
    filename.year
  )
)
