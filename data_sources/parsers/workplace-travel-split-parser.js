import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import stripBom from 'strip-bom-stream'
import { fileURLToPath } from 'url';
import sa2 from '../originals/sa2-2023.json' with { type: 'json' }
import sa3 from '../originals/sa3-2023.json' with { type: 'json' }

const sa2Ids = sa2.features.map(i => i.properties.SA22023_V1)
const sa3Ids = sa3.features.map(i => i.properties.SA32023_V1)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filenames = [
  {
    input: 'commute.csv'
  },
  {
    input: 'education-totals.csv'
  },
  {
    input: 'workplace-totals.csv'
  },
  {
    input: 'sa3-education-totals.csv'
  },
  {
    input: 'sa3-workplace-totals.csv'
  }
]

const results = {
  "2018-education": {},
  "2018-workplace": {},
  "2018-all": {},
  "2023-education": {},
  "2023-workplace": {},
  "2023-all": {},
}

// our parser
const parse = (inputFilename, outputFilename) => {
  fs.createReadStream(inputFilename)
    .pipe(stripBom())
    .pipe(csv())
    .on('data', (data) => {
      // doing a big aggregate
      const areaKey = (data['Area'] || data['SA22023_V1_00_NAME'] || data['SA32023_V1_00_NAME']).trim()

      // skips all the codes that aren't sa2s or sa3s
      if (data['CEN23_TBT_GEO_006'] && !sa2Ids.includes(data['CEN23_TBT_GEO_006']) && !sa3Ids.includes(data['CEN23_TBT_GEO_006'])) {
        return
      }
      if (results["2018-education"][areaKey] === undefined) {
        results["2018-education"][areaKey] = { departureModes: {}, arrivalModes: {}, departTo: {}, arriveFrom: {} },
          results["2018-workplace"][areaKey] = { departureModes: {}, arrivalModes: {}, departTo: {}, arriveFrom: {} },
          results["2018-all"][areaKey] = { departureModes: {}, arrivalModes: {}, departTo: {}, arriveFrom: {} },
          results["2023-education"][areaKey] = { departureModes: {}, arrivalModes: {}, departTo: {}, arriveFrom: {} },
          results["2023-workplace"][areaKey] = { departureModes: {}, arrivalModes: {}, departTo: {}, arriveFrom: {} },
          results["2023-all"][areaKey] = { departureModes: {}, arrivalModes: {}, departTo: {}, arriveFrom: {} }
      }

      // this parses our workplace-total & education-total files
      if (data['leave_SA2'] === '1') {
        if (data['edu_address_18']) {
          const edu_address_18 = parseInt(data['edu_address_18'])
          if (edu_address_18 >= 0) results[`2018-education`][areaKey].arriveFrom['Total-NonResidents'] = edu_address_18
          const ur_address_18 = parseInt(data['ur_address_18'])
          if (ur_address_18 >= 0) results[`2018-education`][areaKey].departTo['Total-NonResidents'] = ur_address_18
          const edu_address_23 = parseInt(data['edu_address_23'])
          if (edu_address_23 >= 0) results[`2023-education`][areaKey].arriveFrom['Total-NonResidents'] = edu_address_23
          const ur_address_23 = parseInt(data['ur_address_23'])
          if (ur_address_23 >= 0) results[`2023-education`][areaKey].departTo['Total-NonResidents'] = ur_address_23
        } else if (data['wp_address_18']) {
          const wp_address_18 = parseInt(data['wp_address_18'])
          if (wp_address_18 >= 0) results[`2018-workplace`][areaKey].arriveFrom['Total-NonResidents'] = wp_address_18
          const ur_address_18 = parseInt(data['ur_address_18'])
          if (ur_address_18 >= 0) results[`2018-workplace`][areaKey].departTo['Total-NonResidents'] = ur_address_18
          const wp_address_23 = parseInt(data['wp_address_23'])
          if (wp_address_23 >= 0) results[`2023-workplace`][areaKey].arriveFrom['Total-NonResidents'] = wp_address_23
          const ur_address_23 = parseInt(data['ur_address_23'])
          if (ur_address_23 >= 0) results[`2023-workplace`][areaKey].departTo['Total-NonResidents'] = ur_address_23
        }
        return
      }

      // this parses commute.csv
      let key = data['Variable codes']
      if (key === undefined) return

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
      if (key === 'Study at home' || key === 'Work at home') {
        key = 'Work/study at home'
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
