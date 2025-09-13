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
    field: '2018_Total_stated',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-1-area-to-area.json',
    field: '2018_Train',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-2-area-to-area.json',
    field: '2018_Public_bus',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-3-area-to-area.json',
    field: '2018_Ferry',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-17-area-to-area.json',
    field: '2018_Drive_a_company_car_truck_or_van',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-6-area-to-area.json',
    field: '2018_Drive_a_private_car_truck_or_van',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-7-area-to-area.json',
    field: '2018_Passenger_in_a_car_truck_van_or_company_bus',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-10-area-to-area.json',
    field: '2018_Bicycle',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-11-area-to-area.json',
    field: '2018_Other',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-12-area-to-area.json',
    field: '2018_Walk_or_jog',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2018-workplace-mode-13-area-to-area.json',
    field: '2018_Work_at_home',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-area-to-area.json',
    field: '2018_Total_stated',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-1-area-to-area.json',
    field: '2018_Train',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-2-area-to-area.json',
    field: '2018_Public_bus',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-18-area-to-area.json',
    field: '2018_School_bus',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-3-area-to-area.json',
    field: '2018_Ferry',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-6-area-to-area.json',
    field: '2018_Drive_a_car_truck_or_van',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-7-area-to-area.json',
    field: '2018_Passenger_in_a_car_truck_or_van',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-10-area-to-area.json',
    field: '2018_Bicycle',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-11-area-to-area.json',
    field: '2018_Other',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-12-area-to-area.json',
    field: '2018_Walk_or_jog',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2018-education-mode-13-area-to-area.json',
    field: '2018_Study_at_home',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-area-to-area.json',
    field: '2023_Total_stated',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-1-area-to-area.json',
    field: '2023_Train',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-2-area-to-area.json',
    field: '2023_Public_bus',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-3-area-to-area.json',
    field: '2023_Ferry',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-17-area-to-area.json',
    field: '2023_Drive_a_company_car_truck_or_van',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-6-area-to-area.json',
    field: '2023_Drive_a_private_car_truck_or_van',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-7-area-to-area.json',
    field: '2023_Passenger_in_a_car_truck_van_or_company_bus',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-10-area-to-area.json',
    field: '2023_Bicycle',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-11-area-to-area.json',
    field: '2023_Other',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-12-area-to-area.json',
    field: '2023_Walk_or_jog',
  },
  {
    input: 'workplace-area-to-area.csv',
    output: '2023-workplace-mode-13-area-to-area.json',
    field: '2023_Work_at_home',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-area-to-area.json',
    field: '2023_Total_stated',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-1-area-to-area.json',
    field: '2023_Train',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-2-area-to-area.json',
    field: '2023_Public_bus',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-18-area-to-area.json',
    field: '2023_School_bus',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-3-area-to-area.json',
    field: '2023_Ferry',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-6-area-to-area.json',
    field: '2023_Drive_a_car_truck_or_van',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-7-area-to-area.json',
    field: '2023_Passenger_in_a_car_truck_or_van',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-10-area-to-area.json',
    field: '2023_Bicycle',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-11-area-to-area.json',
    field: '2023_Other',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-12-area-to-area.json',
    field: '2023_Walk_or_jog',
  },
  {
    input: 'education-area-to-area.csv',
    output: '2023-education-mode-13-area-to-area.json',
    field: '2023_Study_at_home',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-area-to-area.json',
    field: '2018_Total_stated',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-1-area-to-area.json',
    field: '2018_Train',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-2-area-to-area.json',
    field: '2018_Public_bus',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-3-area-to-area.json',
    field: '2018_Ferry',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-17-area-to-area.json',
    field: '2018_Drive_a_company_car_truck_or_van',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-6-area-to-area.json',
    field: '2018_Drive_a_private_car_truck_or_van',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-7-area-to-area.json',
    field: '2018_Passenger_in_a_car_truck_van_or_company_bus',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-10-area-to-area.json',
    field: '2018_Bicycle',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-11-area-to-area.json',
    field: '2018_Other',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-12-area-to-area.json',
    field: '2018_Walk_or_jog',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2018-workplace-mode-13-area-to-area.json',
    field: '2018_Work_at_home',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-area-to-area.json',
    field: '2018_Total_stated',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-1-area-to-area.json',
    field: '2018_Train',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-2-area-to-area.json',
    field: '2018_Public_bus',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-18-area-to-area.json',
    field: '2018_School_bus',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-3-area-to-area.json',
    field: '2018_Ferry',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-6-area-to-area.json',
    field: '2018_Drive_a_car_truck_or_van',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-7-area-to-area.json',
    field: '2018_Passenger_in_a_car_truck_or_van',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-10-area-to-area.json',
    field: '2018_Bicycle',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-11-area-to-area.json',
    field: '2018_Other',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-12-area-to-area.json',
    field: '2018_Walk_or_jog',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2018-education-mode-13-area-to-area.json',
    field: '2018_Study_at_home',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-area-to-area.json',
    field: '2023_Total_stated',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-1-area-to-area.json',
    field: '2023_Train',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-2-area-to-area.json',
    field: '2023_Public_bus',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-3-area-to-area.json',
    field: '2023_Ferry',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-17-area-to-area.json',
    field: '2023_Drive_a_company_car_truck_or_van',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-6-area-to-area.json',
    field: '2023_Drive_a_private_car_truck_or_van',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-7-area-to-area.json',
    field: '2023_Passenger_in_a_car_truck_van_or_company_bus',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-10-area-to-area.json',
    field: '2023_Bicycle',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-11-area-to-area.json',
    field: '2023_Other',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-12-area-to-area.json',
    field: '2023_Walk_or_jog',
  },
  {
    input: 'sa3-workplace-area-to-area.csv',
    output: 'sa3-2023-workplace-mode-13-area-to-area.json',
    field: '2023_Work_at_home',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-area-to-area.json',
    field: '2023_Total_stated',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-1-area-to-area.json',
    field: '2023_Train',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-2-area-to-area.json',
    field: '2023_Public_bus',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-18-area-to-area.json',
    field: '2023_School_bus',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-3-area-to-area.json',
    field: '2023_Ferry',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-6-area-to-area.json',
    field: '2023_Drive_a_car_truck_or_van',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-7-area-to-area.json',
    field: '2023_Passenger_in_a_car_truck_or_van',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-10-area-to-area.json',
    field: '2023_Bicycle',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-11-area-to-area.json',
    field: '2023_Other',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-12-area-to-area.json',
    field: '2023_Walk_or_jog',
  },
  {
    input: 'sa3-education-area-to-area.csv',
    output: 'sa3-2023-education-mode-13-area-to-area.json',
    field: '2023_Study_at_home',
  },
]

// our parser
const parse = (inputFilename, outputFilename, field) => {
  const results = {}
  fs.createReadStream(inputFilename)
    .pipe(stripBom())
    .pipe(csv())
    .on('data', (data) => {
      const homeAddress = (
        data['SA22023_V1_00_NAME_usual_residence_address'] ||
        data['SA32023_V1_00_NAME_usual_residence_address']
      ).trim()
      const workAddress = (
        data['SA22023_V1_00_NAME_workplace_address'] ||
        data['SA22023_V1_00_NAME_educational_institution_address'] ||
        data['SA32023_V1_00_NAME_workplace_address'] ||
        data['SA32023_V1_00_NAME_educational_institution_address']
      ).trim()
      const total = parseInt(data[field], 10)
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
    filename.field
  )
)
