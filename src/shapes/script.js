const fs = require('fs')
const geojson = JSON.parse(fs.readFileSync('./sa3.geojson'))

const transformFilename = (name) => {
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[()\/]/g, '')
}

geojson.features = geojson.features
  .map((i) => ({
    type: i.type,
    geometry: i.geometry,
    properties: { name: i.properties.SA22018__1 },
  }))
  .filter((i) => {
    const data = JSON.parse(
      fs.readFileSync(
        `../../dist/data/regions/${transformFilename(i.properties.name)}.json`
      )
    )
    const isEmpty = !(
      data.education.departTo ||
      data.education.arriveFrom ||
      data.workplace.departTo ||
      data.workplace.arriveFrom
    )
    const isWater =
      i.properties.name.includes('Oceanic') ||
      i.properties.name.includes('Inlet') ||
      i.properties.name.includes('Inland water') ||
      i.properties.name.includes('Bays')

    if (isEmpty && !isWater) {
      console.log(i.properties.name, 'is empty and not water!')
    }
    return !(isEmpty && isWater)
  })

fs.writeFileSync('./sa4.geojson', JSON.stringify(geojson))
console.log('Processed!')
