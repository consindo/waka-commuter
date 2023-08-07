const fs = require('fs')
const path = require('path')

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
      targetObject[subkey2] = {}
      targetObject = targetObject[subkey2]
    }

    // copies items across
    Object.assign(targetObject, data[key])
  })
  console.log('Added', Object.keys(data).length, 'keys from', filename)
}

combineFile('education-area-to-area.json', 'education')
combineFile('workplace-area-to-area.json', 'workplace')
combineFile('education-commute-in.json', 'education', 'arrivalModes')
combineFile('education-commute-out.json', 'education', 'departureModes')
combineFile('workplace-commute-in.json', 'workplace', 'arrivalModes')
combineFile('workplace-commute-out.json', 'workplace', 'departureModes')
combineFile('ethnicity.json', 'ethnicity')

// save it all to one big file
const outputFilename = path.join(
  __dirname,
  '../outputs',
  'combined-output.json'
)
fs.writeFileSync(outputFilename, JSON.stringify(finalResult, '', 2))
console.log('Written to', outputFilename)
