const sources = {
  commuterview: {
    shapeFile: '/shapes/sa2-optimized.json',
    initialPosition: [173, -40, 5.5],
    isModeGraphsEnabled: true,
    isAllSegmentEnabled: true,
    isMapAreaLabelsEnabled: false,
    segments: ['workplace', 'education'],
    detailsControls: ['All', 'Workplace', 'Education'],
    brandingClass: 'statsnz',
  },
  covid: {
    shapeFile: '/shapes/sa2-optimized.json',
    initialPosition: [173, -40, 5.5],
    isModeGraphsEnabled: true,
    isAllSegmentEnabled: true,
    isMapAreaLabelsEnabled: false,
    segments: ['workplace', 'education'],
    detailsControls: ['All', 'Workplace', 'Education'],
    brandingClass: 'covid',
  },
  wsp: {
    shapeFile: '/shapes/extras/wsp-zones-optimized.json',
    initialPosition: [172.5, -43.53, 9.5],
    isModeGraphsEnabled: false,
    isAllSegmentEnabled: false,
    isMapAreaLabelsEnabled: 'friendlyName',
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
    detailsControls: ['AM2hr', 'IP4hr', 'PM2hr', 'DY'],
    detailsSecondaryControls: ['2018', '2028', '2038', '2048'],
    brandingClass: 'wsp',
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
