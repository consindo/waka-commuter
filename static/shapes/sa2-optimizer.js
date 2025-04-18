import fs from 'fs'
const geojson = JSON.parse(fs.readFileSync('./sa2-2023.json'))

const transformFilename = (name) => {
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[()\/]/g, '')
}

const truncator = (num) => {
  if (typeof num === 'number') {
    return parseFloat(num.toFixed(5))
  }
  return num.map(truncator)
}

geojson.features = geojson.features
  .filter((i) => i.geometry !== null)
  .map((i) => {
    return {
      type: i.type,
      geometry: {
        ...i.geometry,
        coordinates: i.geometry['coordinates'].map(truncator),
      },
      properties: { name: i.properties.SA22023__1 },
    }
  })
  .filter((i) => {
    let data
    try {
      data = JSON.parse(
        fs.readFileSync(
          `../../dist/data/regions/${transformFilename(i.properties.name)}.json`
        )
      )
    } catch (err) {
      console.warn('skipping optimization of', `${i.properties.name}.json`)
      return true
    }
    const isEmpty = !(
      data['2023-education'].departTo ||
      data['2023-education'].arriveFrom ||
      data['2023-workplace'].departTo ||
      data['2023-workplace'].arriveFrom
    )
    const isWater =
      i.properties.name.includes('Oceanic') ||
      i.properties.name.includes('Inlet') ||
      i.properties.name.includes('Inland water') ||
      i.properties.name.includes('Bays') ||
      i.properties.name.includes('Island')

    if (isEmpty && !isWater) {
      console.log(i.properties.name, 'is empty and not water!')
    }
    return !(isEmpty && isWater)
  })

fs.writeFileSync('./sa2-2023-optimized.json', JSON.stringify(geojson))
console.log('Processed!')
