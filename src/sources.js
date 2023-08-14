import sa2 from '../static/shapes/sa2-optimized.json?url'

const sources = {
  commuterview: {
    shapeFile: sa2,
    initialPosition: [173, -40, 5.5],
    isModeGraphsEnabled: true,
    isAllSegmentEnabled: true,
    isMapAreaLabelsEnabled: false,
    segments: ['workplace', 'education'],
    detailsControls: ['All', 'Workplace', 'Education'],
    brandingClass: 'statsnz',
  },
  ason: {
    shapeFile: '/shapes/australia-sa2-2021-truncated.json',
    dynamicShapeFiles: [
      {
        url: '/shapes/australia-sa2-2021-nsw.json',
        bbox: [[141, -37.5], [154, -28]],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-vic.json',
        bbox: [[141, -39], [151, -34]],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-qld.json',
        bbox: [[138, -29], [153, -10]],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-wa.json',
        bbox: [[112, -35], [129, -12]],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-sa.json',
        bbox: [[129, -38], [141, -26]],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-tas.json',
        bbox: [[143, -44], [149, -39]],
        zoom: 6,
      },      
      {
        url: '/shapes/australia-sa2-2021-nt.json',
        bbox: [[129, -26], [138, -10]],
        zoom: 5,
      }
    ],
    initialPosition: [133, -25, 4],
    isModeGraphsEnabled: false,
    isAllSegmentEnabled: false,
    isMapAreaLabelsEnabled: false,
    segments: ['2021-sa2'],
    detailsControls: ['All'],
    brandingClass: 'statsnz',
  },
  wsp: {
    shapeFile: '/shapes/wsp-zones-optimized.json',
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
  const source = import.meta.env.VITE_WAKA_COMMUTER_SOURCE || 'commuterview'
  const sourceObj = sources[source]
  if (sourceObj === undefined || sourceObj.shapeFile === undefined) {
    console.error('Could not find source', source, sourceObj)
  }
  return sources[source]
}
