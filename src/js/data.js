// finds the mid point of a geojson feature
export const getLocation = (features, name) => {
  let geometry
  try {
    geometry = features.find((i) => i.properties.name === name).geometry
  } catch (err) {
    console.error('Could not find', name, err)
    return { lat: 0, lng: 0 }
  }

  let coords = geometry.coordinates[0]
  if (geometry.type === 'MultiPolygon') {
    coords = geometry.coordinates[0][0]
  }

  return mapboxgl.LngLatBounds.convert(coords).getCenter()
}

// converts the data from the raw json
// does aggregation and latlng mapping
export const transformData = (
  features,
  dataSources,
  category,
  baselat = 0,
  baselng = 0
) => {
  // sums the total values together
  const combinedSource = {}
  dataSources.forEach((source) => {
    // if the key doesn't exist, just skip iteration
    if (source[category] === undefined) return
    Object.keys(source[category]).forEach((location) => {
      if (combinedSource[location] === undefined) {
        combinedSource[location] = 0
      }
      combinedSource[location] += source[category][location]
    })
  })
  return JSON.stringify(
    Object.keys(combinedSource).map((i) => {
      const coords = getLocation(features, i)
      return {
        key: i,
        value: combinedSource[i],
        x: (coords.lng - baselng) * 400, // lng requires more scaling that lat
        y: (coords.lat - baselat) * -300, // make it positive so it works the same way
      }
    })
  )
}
