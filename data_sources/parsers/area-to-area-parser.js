const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

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
