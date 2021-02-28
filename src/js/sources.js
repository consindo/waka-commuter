const extras = require('../../commuterview-extras/**/*-optimized.geojson')
const sources = {
  commuterview: {
    shapeFile: require('../shapes/sa2-optimized.geojson'),
  },
  wsp: {
    shapeFile: extras.shapes?.['wsp-zones'],
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
