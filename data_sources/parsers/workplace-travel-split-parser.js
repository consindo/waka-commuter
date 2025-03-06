import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import stripBom from 'strip-bom-stream'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filenames = [
  {
    input: 'commute.csv'
  }
]

// our parser
const parse = (inputFilename, outputFilename) => {
  const results = {
    "2018-education": {},
    "2018-workplace": {},
    "2018-all": {},
    "2023-education": {},
    "2023-workplace": {},
    "2023-all": {},
  }
  fs.createReadStream(inputFilename)
    .pipe(stripBom())
    .pipe(csv())
    .on('data', (data) => {
      // doing a big aggregate
      const areaKey = data['Area'].trim()
      if (results["2018-education"][areaKey] === undefined) {
        results["2018-education"][areaKey] = { departureModes: {}, arrivalModes: {} },
          results["2018-workplace"][areaKey] = { departureModes: {}, arrivalModes: {} },
          results["2018-all"][areaKey] = { departureModes: {}, arrivalModes: {} },
          results["2023-education"][areaKey] = { departureModes: {}, arrivalModes: {} },
          results["2023-workplace"][areaKey] = { departureModes: {}, arrivalModes: {} },
          results["2023-all"][areaKey] = { departureModes: {}, arrivalModes: {} }
      }

      let key = data['Variable codes']

      // because in the data set it's "Total stated - main means of travel to education/work"
      if (key.toLowerCase().includes('total')) {
        if (key.includes('Total stated')) {
          key = 'Total'
        } else {
          return // there's another field but skip it otherwise
        }
      }

      // these are basically the same
      if (
        key === 'Passenger in a car, truck, van or company bus' ||
        key === 'Passenger in a car, truck or van'
      ) {
        key = 'Passenger in a car, truck, van, or company bus'
      }

      // assume that all the education cars are private, just so we can group better
      // at least i hope no educational institution gives you a car
      if (key === 'Drive a car, truck or van') {
        key = 'Drive a private car, truck or van'
      }

      // again, better grouping
      if (key === 'Study at home') {
        key = 'Work at home'
      }

      const value = parseInt(data['OBS_VALUE'], 10) || 0
      const year = data['CEN23_YEAR_001']

      if (data['CEN23_TBT_IND_003'].startsWith('tee')) {
        results[`${year}-education`][areaKey].arrivalModes[key] = value
        results[`${year}-all`][areaKey].arrivalModes[key] = results[`${year}-all`][areaKey].arrivalModes[key] || 0
        results[`${year}-all`][areaKey].arrivalModes[key] += value
      } else if (data['CEN23_TBT_IND_003'].startsWith('teu')) {
        results[`${year}-education`][areaKey].departureModes[key] = value
        results[`${year}-all`][areaKey].departureModes[key] = results[`${year}-all`][areaKey].departureModes[key] || 0
        results[`${year}-all`][areaKey].departureModes[key] += value
      } else if (data['CEN23_TBT_IND_003'].startsWith('tww')) {
        results[`${year}-workplace`][areaKey].arrivalModes[key] = value
        results[`${year}-all`][areaKey].arrivalModes[key] = results[`${year}-all`][areaKey].arrivalModes[key] || 0
        results[`${year}-all`][areaKey].arrivalModes[key] += value
      } else if (data['CEN23_TBT_IND_003'].startsWith('twu')) {
        results[`${year}-workplace`][areaKey].departureModes[key] = value
        results[`${year}-all`][areaKey].departureModes[key] = results[`${year}-all`][areaKey].departureModes[key] || 0
        results[`${year}-all`][areaKey].departureModes[key] += value
      }
    })
    .on('end', () => {
      Object.keys(results).forEach(i => {
        fs.writeFileSync(path.join(outputFilename, `${i}-commute.json`), JSON.stringify(results[i], '', 2))
        console.log(`Converted ${inputFilename} into ${outputFilename}/${i}-commute.json`)
      })
    })
}

// run the code
filenames.forEach((filename) =>
  parse(
    path.join(__dirname, '../originals', filename.input),
    path.join(__dirname, '../outputs')
  )
)
