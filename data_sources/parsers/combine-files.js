import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

import sa2 from '../originals/sa2-2023.json' with { type: 'json' }
import sa3 from '../originals/sa3-2023.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const finalResult = {}

const combineFile = (filename, subkey, subkey2) => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../outputs', filename)).toString()
  )

  Object.keys(data).forEach((key) => {
    let keyName = key
    if (filename.includes('sa3-')) {
      keyName = `sa3-${key}`
    }
    if (finalResult[keyName] === undefined) {
      const region = sa2.features.find(i => i.properties.SA22023__1 === key)
      let code = region?.properties.SA22023_V1
      if (filename.includes('sa3-')) {
        const region = sa3.features.find(i => i.properties.SA32023__1 === key)
        code = region?.properties.SA32023_V1
      }
      finalResult[keyName] = {
        id: key,
        code,
      }
    }

    // if we want everything in a subkey, set that up
    let targetObject = finalResult[keyName]
    if (subkey != null) {
      // don't overwrite the object
      if (finalResult[keyName][subkey] === undefined) {
        targetObject[subkey] = {}
      }
      // new target object
      targetObject = targetObject[subkey]
    }

    // basically the same as above, but can't be bothered with a loop
    if (subkey2 != null) {
      // don't overwrite the object
      if (finalResult[keyName][subkey][subkey2] === undefined) {
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

combineFile('sa3-2018-education-area-to-area.json', '2018-education')
combineFile('sa3-2018-education-mode-1-area-to-area.json', '2018-education-mode-1')
combineFile('sa3-2018-education-mode-2-area-to-area.json', '2018-education-mode-2')
combineFile('sa3-2018-education-mode-3-area-to-area.json', '2018-education-mode-3')
combineFile('sa3-2018-education-mode-6-area-to-area.json', '2018-education-mode-6')
combineFile('sa3-2018-education-mode-7-area-to-area.json', '2018-education-mode-7')
combineFile('sa3-2018-education-mode-10-area-to-area.json', '2018-education-mode-10')
combineFile('sa3-2018-education-mode-11-area-to-area.json', '2018-education-mode-11')
combineFile('sa3-2018-education-mode-12-area-to-area.json', '2018-education-mode-12')
combineFile('sa3-2018-education-mode-13-area-to-area.json', '2018-education-mode-13')
combineFile('sa3-2018-education-mode-18-area-to-area.json', '2018-education-mode-18')

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

combineFile('sa3-2018-workplace-area-to-area.json', '2018-workplace')
combineFile('sa3-2018-workplace-mode-1-area-to-area.json', '2018-workplace-mode-1')
combineFile('sa3-2018-workplace-mode-2-area-to-area.json', '2018-workplace-mode-2')
combineFile('sa3-2018-workplace-mode-3-area-to-area.json', '2018-workplace-mode-3')
combineFile('sa3-2018-workplace-mode-6-area-to-area.json', '2018-workplace-mode-6')
combineFile('sa3-2018-workplace-mode-7-area-to-area.json', '2018-workplace-mode-7')
combineFile('sa3-2018-workplace-mode-10-area-to-area.json', '2018-workplace-mode-10')
combineFile('sa3-2018-workplace-mode-11-area-to-area.json', '2018-workplace-mode-11')
combineFile('sa3-2018-workplace-mode-12-area-to-area.json', '2018-workplace-mode-12')
combineFile('sa3-2018-workplace-mode-13-area-to-area.json', '2018-workplace-mode-13')
combineFile('sa3-2018-workplace-mode-17-area-to-area.json', '2018-workplace-mode-17')

// 2018 commute
combineFile('2018-education-commute.json', '2018-education')
combineFile('2018-workplace-commute.json', '2018-workplace')

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

combineFile('sa3-2023-education-area-to-area.json', '2023-education')
combineFile('sa3-2023-education-mode-1-area-to-area.json', '2023-education-mode-1')
combineFile('sa3-2023-education-mode-2-area-to-area.json', '2023-education-mode-2')
combineFile('sa3-2023-education-mode-3-area-to-area.json', '2023-education-mode-3')
combineFile('sa3-2023-education-mode-6-area-to-area.json', '2023-education-mode-6')
combineFile('sa3-2023-education-mode-7-area-to-area.json', '2023-education-mode-7')
combineFile('sa3-2023-education-mode-10-area-to-area.json', '2023-education-mode-10')
combineFile('sa3-2023-education-mode-11-area-to-area.json', '2023-education-mode-11')
combineFile('sa3-2023-education-mode-12-area-to-area.json', '2023-education-mode-12')
combineFile('sa3-2023-education-mode-13-area-to-area.json', '2023-education-mode-13')
combineFile('sa3-2023-education-mode-18-area-to-area.json', '2023-education-mode-18')

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

combineFile('sa3-2023-workplace-area-to-area.json', '2023-workplace')
combineFile('sa3-2023-workplace-mode-1-area-to-area.json', '2023-workplace-mode-1')
combineFile('sa3-2023-workplace-mode-2-area-to-area.json', '2023-workplace-mode-2')
combineFile('sa3-2023-workplace-mode-3-area-to-area.json', '2023-workplace-mode-3')
combineFile('sa3-2023-workplace-mode-6-area-to-area.json', '2023-workplace-mode-6')
combineFile('sa3-2023-workplace-mode-7-area-to-area.json', '2023-workplace-mode-7')
combineFile('sa3-2023-workplace-mode-10-area-to-area.json', '2023-workplace-mode-10')
combineFile('sa3-2023-workplace-mode-11-area-to-area.json', '2023-workplace-mode-11')
combineFile('sa3-2023-workplace-mode-12-area-to-area.json', '2023-workplace-mode-12')
combineFile('sa3-2023-workplace-mode-13-area-to-area.json', '2023-workplace-mode-13')
combineFile('sa3-2023-workplace-mode-17-area-to-area.json', '2023-workplace-mode-17')

// 2023 commute
combineFile('2023-education-commute.json', '2023-education')
combineFile('2023-workplace-commute.json', '2023-workplace')

// save it all to one big file
const outputFilename = path.join(
  __dirname,
  '../outputs',
  'combined-output.json'
)
fs.writeFileSync(outputFilename, JSON.stringify(finalResult, '', 2))
console.log('Written to', outputFilename)
