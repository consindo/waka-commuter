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
    output: 'workplace-area-to-area.json',
  },
  {
    input: 'education-area-to-area.csv',
    output: 'education-area-to-area.json',
  },
]

// our parser
const parse = (inputFilename, outputFilename) => {
  const results = {}
  fs.createReadStream(inputFilename)
    .pipe(stripBom())
    .pipe(csv())
    .on('data', (data) => {
      const homeAddress = data['SA2_name_usual_residence_address'].trim()
      const workAddress = (
        data['SA2_name_workplace_address'] ||
        data['SA2_name_educational_address']
      ).trim()
      const total = parseInt(data['Total'], 10)

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
    path.join(__dirname, '../outputs', filename.output)
  )
)
