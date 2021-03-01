const extras = require('../../commuterview-extras/**/*-optimized.geojson')
const sources = {
  commuterview: {
    shapeFile: require('../shapes/sa2-optimized.geojson'),
    initialPosition: [173, -40, 5.5],
  },
  wsp: {
    shapeFile: extras.shapes?.['wsp-zones'],
    initialPosition: [172.5, -43.53, 9.5],
  },
}

export const getSource = () => {
  const source = process.env.WAKA_COMMUTER_SOURCE || 'commuterview'
  const sourceObj = sources[source]
  if (sourceObj === undefined || sourceObj.shapeFile === undefined) {
    console.error('Could not find source', source, sourceObj)
  }
  return sources[source]
}
