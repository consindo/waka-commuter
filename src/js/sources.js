const extras = require('../../commuterview-extras/**/*-optimized.geojson')
const sources = {
  commuterview: {
    shapeFile: require('../shapes/sa2-optimized.geojson'),
    initialPosition: [173, -40, 5.5],
    isModeGraphsEnabled: true,
    isAllSegmentEnabled: true,
    segments: ['workplace', 'education'],
  },
  wsp: {
    shapeFile: extras.shapes?.['wsp-zones'],
    initialPosition: [172.5, -43.53, 9.5],
    isModeGraphsEnabled: false,
    isAllSegmentEnabled: false,
    segments: [
      '2018-am2hr',
      '2018-ip4hr',
      '2018-pm2hr',
      '2018-dy',
      '2028-am2hr',
      '2028-ip4hr',
      '2028-pm2hr',
      '2028-dy',
      '2038-am2hr',
      '2038-ip4hr',
      '2038-pm2hr',
      '2038-dy',
      '2048-am2hr',
      '2048-ip4hr',
      '2048-pm2hr',
      '2048-dy',
    ],
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
