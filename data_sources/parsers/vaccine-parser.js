const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const stripBom = require('strip-bom-stream')

const filenames = [
  {
    input: 'vaccines-total.csv',
    output: 'vaccines-total.json',
  },
  {
    input: 'vaccines-maori.csv',
    output: 'vaccines-maori.json',
  },
  {
    input: 'vaccines-pacific.csv',
    output: 'vaccines-pacific.json',
  },
]

const parseNumber = (number, rate) => {
  // fuzzyness
  if (number === 'masked') {
    // this will be the pop times the rate, which should give an accurate estimate
    if (rate) return rate
    return 0
  }
  if (number === '>950') {
    return 1000
  } else if (number === '5 or less' || number === '<50') {
    return 0
  }
  return parseInt(number, 10)
}

// our parser
const parse = (inputFilename, outputFilename) => {
  const results = {}
  fs.createReadStream(inputFilename)
    .pipe(stripBom())
    .pipe(csv())
    .on('data', (data) => {
      // doing a big aggregate
      const area = data['sa2_name'].trim()
      if (results[area] === undefined) {
        results[area] = {}
      }

      results[area].populationCount = parseNumber(data['pop_cnt'])
      results[area].dose1Uptake = parseNumber(data['dose1_uptake'])
      results[area].dose2Uptake = parseNumber(data['dose2_uptake'])
      results[area].dose1Count = parseNumber(
        data['dose1_cnt'],
        (results[area].populationCount * results[area].dose1Uptake) / 1000
      )
      results[area].dose2Count = parseNumber(
        data['dose2_cnt'],
        (results[area].populationCount * results[area].dose2Uptake) / 1000
      )
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
