import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const finalResult = {}

const combineFile = (filename, subkey, subkey2) => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../outputs', filename)).toString()
  )

  Object.keys(data).forEach((key) => {
    if (finalResult[key] === undefined) {
      finalResult[key] = {
        id: key,
      }
    }

    // if we want everything in a subkey, set that up
    let targetObject = finalResult[key]
    if (subkey != null) {
      // don't overwrite the object
      if (finalResult[key][subkey] === undefined) {
        targetObject[subkey] = {}
      }
      // new target object
      targetObject = targetObject[subkey]
    }

    // basically the same as above, but can't be bothered with a loop
    if (subkey2 != null) {
      // don't overwrite the object
      if (finalResult[key][subkey][subkey2] === undefined) {
        targetObject[subkey2] = {}
      }
      targetObject = targetObject[subkey2]
    }

    // copies items across
    Object.assign(targetObject, data[key])
  })
  console.log('Added', Object.keys(data).length, 'keys from', filename)
}

combineFile('concordance-friendly.json', 'concordance')
combineFile('education-area-to-area.json', '2018-education')
combineFile('workplace-area-to-area.json', '2018-workplace')
combineFile('education-commute-in.json', '2018-education', 'arrivalModes')
combineFile('education-commute-out.json', '2018-education', 'departureModes')
combineFile('workplace-commute-in.json', '2018-workplace', 'arrivalModes')
combineFile('workplace-commute-out.json', '2018-workplace', 'departureModes')

// TODO!
combineFile('education-area-to-area.json', '2023-education')
combineFile('workplace-area-to-area.json', '2023-workplace')
combineFile('education-commute-in.json', '2023-education', 'arrivalModes')
combineFile('education-commute-out.json', '2023-education', 'departureModes')
combineFile('workplace-commute-in.json', '2023-workplace', 'arrivalModes')
combineFile('workplace-commute-out.json', '2023-workplace', 'departureModes')

combineFile('ethnicity.json', 'ethnicity')

// save it all to one big file
const outputFilename = path.join(
  __dirname,
  '../outputs',
  'combined-output.json'
)
fs.writeFileSync(outputFilename, JSON.stringify(finalResult, '', 2))
console.log('Written to', outputFilename)
