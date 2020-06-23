const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const filenames = [
  {
    input: 'workplace-commute-in.csv',
    output: 'workplace-commute-in.json',
  },
  {
    input: 'workplace-commute-out.csv',
    output: 'workplace-commute-out.json',
  },
  {
    input: 'education-commute-in.csv',
    output: 'education-commute-in.json',
  },
  {
    input: 'education-commute-out.csv',
    output: 'education-commute-out.json',
  },
]

// our parser
const parse = (inputFilename, outputFilename) => {
  const results = {}
  fs.createReadStream(inputFilename)
    .pipe(csv())
    .on('data', (data) => {
      // doing a big aggregate
      if (results[data['Area'].trim()] === undefined) {
        results[data['Area'].trim()] = {}
      }

      let key =
        data['Main means of travel to work'] ||
        data['Main means of travel to education']

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
