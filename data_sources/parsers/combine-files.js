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

    // merges the object nicely
    Object.keys(data[key]).forEach(subkey3 => {
      if (typeof data[key][subkey3] === 'object' && data[key][subkey3] !== null && !Array.isArray(data[key][subkey3])) {
        targetObject[subkey3] = targetObject[subkey3] || {}
        Object.keys(data[key][subkey3]).forEach(subkey4 => {
          targetObject[subkey3][subkey4] = targetObject[subkey3][subkey4] || 0
          targetObject[subkey3][subkey4] += data[key][subkey3][subkey4]
        })
      } else if (typeof data[key][subkey3] === 'number') {
        targetObject[subkey3] = targetObject[subkey3] || 0
        targetObject[subkey3] += data[key][subkey3]
      } else {
        targetObject[subkey3] = data[key][subkey3]
      }
    })
  })
  console.log('Added', Object.keys(data).length, 'keys from', filename, subkey)
}

// 2018 education
combineFile('2018-education-area-to-area.json', '2018-education')
combineFile('2018-education-mode-1-area-to-area.json', '2018-education-mode-1')
combineFile('2018-education-mode-2-area-to-area.json', '2018-education-mode-2')
combineFile('2018-education-mode-3-area-to-area.json', '2018-education-mode-3')
combineFile('2018-education-mode-6-area-to-area.json', '2018-education-mode-6')
combineFile('2018-education-mode-7-area-to-area.json', '2018-education-mode-7')
combineFile('2018-education-mode-10-area-to-area.json', '2018-education-mode-10')
combineFile('2018-education-mode-11-area-to-area.json', '2018-education-mode-11')
combineFile('2018-education-mode-12-area-to-area.json', '2018-education-mode-12')
combineFile('2018-education-mode-13-area-to-area.json', '2018-education-mode-13')
combineFile('2018-education-mode-18-area-to-area.json', '2018-education-mode-18')

// 2018 workplace
combineFile('2018-workplace-area-to-area.json', '2018-workplace')
combineFile('2018-workplace-mode-1-area-to-area.json', '2018-workplace-mode-1')
combineFile('2018-workplace-mode-2-area-to-area.json', '2018-workplace-mode-2')
combineFile('2018-workplace-mode-3-area-to-area.json', '2018-workplace-mode-3')
combineFile('2018-workplace-mode-6-area-to-area.json', '2018-workplace-mode-6')
combineFile('2018-workplace-mode-7-area-to-area.json', '2018-workplace-mode-7')
combineFile('2018-workplace-mode-10-area-to-area.json', '2018-workplace-mode-10')
combineFile('2018-workplace-mode-11-area-to-area.json', '2018-workplace-mode-11')
combineFile('2018-workplace-mode-12-area-to-area.json', '2018-workplace-mode-12')
combineFile('2018-workplace-mode-13-area-to-area.json', '2018-workplace-mode-13')
combineFile('2018-workplace-mode-17-area-to-area.json', '2018-workplace-mode-17')

// 2018 all - education
combineFile('2018-education-area-to-area.json', '2018-all')
combineFile('2018-education-mode-1-area-to-area.json', '2018-all-mode-1')
combineFile('2018-education-mode-2-area-to-area.json', '2018-all-mode-2')
combineFile('2018-education-mode-3-area-to-area.json', '2018-all-mode-3')
combineFile('2018-education-mode-6-area-to-area.json', '2018-all-mode-6')
combineFile('2018-education-mode-7-area-to-area.json', '2018-all-mode-7')
combineFile('2018-education-mode-10-area-to-area.json', '2018-all-mode-10')
combineFile('2018-education-mode-11-area-to-area.json', '2018-all-mode-11')
combineFile('2018-education-mode-12-area-to-area.json', '2018-all-mode-12')
combineFile('2018-education-mode-13-area-to-area.json', '2018-all-mode-13')
combineFile('2018-education-mode-18-area-to-area.json', '2018-all-mode-18')

// 2018 all - workplace
combineFile('2018-workplace-area-to-area.json', '2018-all')
combineFile('2018-workplace-mode-1-area-to-area.json', '2018-all-mode-1')
combineFile('2018-workplace-mode-2-area-to-area.json', '2018-all-mode-2')
combineFile('2018-workplace-mode-3-area-to-area.json', '2018-all-mode-3')
combineFile('2018-workplace-mode-6-area-to-area.json', '2018-all-mode-6')
combineFile('2018-workplace-mode-7-area-to-area.json', '2018-all-mode-7')
combineFile('2018-workplace-mode-10-area-to-area.json', '2018-all-mode-10')
combineFile('2018-workplace-mode-11-area-to-area.json', '2018-all-mode-11')
combineFile('2018-workplace-mode-12-area-to-area.json', '2018-all-mode-12')
combineFile('2018-workplace-mode-13-area-to-area.json', '2018-all-mode-13')
combineFile('2018-workplace-mode-17-area-to-area.json', '2018-all-mode-17')

// 2018 commute
combineFile('2018-education-commute.json', '2018-education')
combineFile('2018-workplace-commute.json', '2018-workplace')
combineFile('2018-all-commute.json', '2018-all')

// 2023 education
combineFile('2023-education-area-to-area.json', '2023-education')
combineFile('2023-education-mode-1-area-to-area.json', '2023-education-mode-1')
combineFile('2023-education-mode-2-area-to-area.json', '2023-education-mode-2')
combineFile('2023-education-mode-3-area-to-area.json', '2023-education-mode-3')
combineFile('2023-education-mode-6-area-to-area.json', '2023-education-mode-6')
combineFile('2023-education-mode-7-area-to-area.json', '2023-education-mode-7')
combineFile('2023-education-mode-10-area-to-area.json', '2023-education-mode-10')
combineFile('2023-education-mode-11-area-to-area.json', '2023-education-mode-11')
combineFile('2023-education-mode-12-area-to-area.json', '2023-education-mode-12')
combineFile('2023-education-mode-13-area-to-area.json', '2023-education-mode-13')
combineFile('2023-education-mode-18-area-to-area.json', '2023-education-mode-18')

// 2023 workplace
combineFile('2023-workplace-area-to-area.json', '2023-workplace')
combineFile('2023-workplace-mode-1-area-to-area.json', '2023-workplace-mode-1')
combineFile('2023-workplace-mode-2-area-to-area.json', '2023-workplace-mode-2')
combineFile('2023-workplace-mode-3-area-to-area.json', '2023-workplace-mode-3')
combineFile('2023-workplace-mode-6-area-to-area.json', '2023-workplace-mode-6')
combineFile('2023-workplace-mode-7-area-to-area.json', '2023-workplace-mode-7')
combineFile('2023-workplace-mode-10-area-to-area.json', '2023-workplace-mode-10')
combineFile('2023-workplace-mode-11-area-to-area.json', '2023-workplace-mode-11')
combineFile('2023-workplace-mode-12-area-to-area.json', '2023-workplace-mode-12')
combineFile('2023-workplace-mode-13-area-to-area.json', '2023-workplace-mode-13')
combineFile('2023-workplace-mode-17-area-to-area.json', '2023-workplace-mode-17')

// 2023 all - education
combineFile('2023-education-area-to-area.json', '2023-all')
combineFile('2023-education-mode-1-area-to-area.json', '2023-all-mode-1')
combineFile('2023-education-mode-2-area-to-area.json', '2023-all-mode-2')
combineFile('2023-education-mode-3-area-to-area.json', '2023-all-mode-3')
combineFile('2023-education-mode-6-area-to-area.json', '2023-all-mode-6')
combineFile('2023-education-mode-7-area-to-area.json', '2023-all-mode-7')
combineFile('2023-education-mode-10-area-to-area.json', '2023-all-mode-10')
combineFile('2023-education-mode-11-area-to-area.json', '2023-all-mode-11')
combineFile('2023-education-mode-12-area-to-area.json', '2023-all-mode-12')
combineFile('2023-education-mode-13-area-to-area.json', '2023-all-mode-13')
combineFile('2023-education-mode-18-area-to-area.json', '2023-all-mode-18')

// 2023 all - workplace
combineFile('2023-workplace-area-to-area.json', '2023-all')
combineFile('2023-workplace-mode-1-area-to-area.json', '2023-all-mode-1')
combineFile('2023-workplace-mode-2-area-to-area.json', '2023-all-mode-2')
combineFile('2023-workplace-mode-3-area-to-area.json', '2023-all-mode-3')
combineFile('2023-workplace-mode-6-area-to-area.json', '2023-all-mode-6')
combineFile('2023-workplace-mode-7-area-to-area.json', '2023-all-mode-7')
combineFile('2023-workplace-mode-10-area-to-area.json', '2023-all-mode-10')
combineFile('2023-workplace-mode-11-area-to-area.json', '2023-all-mode-11')
combineFile('2023-workplace-mode-12-area-to-area.json', '2023-all-mode-12')
combineFile('2023-workplace-mode-13-area-to-area.json', '2023-all-mode-13')
combineFile('2023-workplace-mode-17-area-to-area.json', '2023-all-mode-17')

// 2023 commute
combineFile('2023-education-commute.json', '2023-education')
combineFile('2023-workplace-commute.json', '2023-workplace')
combineFile('2023-all-commute.json', '2023-all')

// save it all to one big file
const outputFilename = path.join(
  __dirname,
  '../outputs',
  'combined-output.json'
)
fs.writeFileSync(outputFilename, JSON.stringify(finalResult, '', 2))
console.log('Written to', outputFilename)
