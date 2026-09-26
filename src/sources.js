import sa22023 from '../static/shapes/sa2-2023-optimized.json?url'
import sa22023small from '../static/shapes/sa2-2023-small-optimized.json?url'
import sa32023 from '../static/shapes/sa3-2023-optimized.json?url'
import sa32023small from '../static/shapes/sa3-2023-small-optimized.json?url'

const useSa3 = window.location.search === '?mode=sa3'

const sources = {
  commuterview: {
    shapeFile: useSa3 ? sa32023small : sa22023small,
    dynamicShapeFiles: [
      {
        url: useSa3 ? sa32023 : sa22023,
        bbox: [
          [161, -48],
          [186, -32],
        ],
        zoom: 6,
      },
    ],
    initialPosition: [173, -40, 5.5],
    isModeGraphsEnabled: true,
    mapAreaLabelsToggleValue: false,
    canMultiSelect: false,
    isMapAreaLabelsEnabled: 'name',
    segments: [
      '2023-workplace',
      '2023-education',
      '2018-workplace',
      '2018-education',
    ],
    detailsControls: ['Workplace', 'Education'],
    detailsSecondaryControls: ['2023', '2018', 'Comparison'],
    brandingClass: 'statsnz',
  },
  ason: {
    title: 'Ason Group Explorer',
    shapeFile: '/shapes/australia-sa2-2021-truncated.json',
    secondaryShapeFile: '/shapes/australia-dzn-2021-truncated.json',
    tertiaryShapeFile: '/shapes/australia-tz-2016-nsw.json',
    dynamicShapeFiles: [
      {
        url: '/shapes/australia-sa2-2021-nsw.json',
        bbox: [
          [141, -37.5],
          [154, -28],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-vic.json',
        bbox: [
          [141, -39],
          [151, -34],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-qld.json',
        bbox: [
          [138, -29],
          [153, -10],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-wa.json',
        bbox: [
          [112, -35],
          [129, -12],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-sa.json',
        bbox: [
          [129, -38],
          [141, -26],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-tas.json',
        bbox: [
          [143, -44],
          [149, -39],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2021-nt.json',
        bbox: [
          [129, -26],
          [138, -10],
        ],
        zoom: 5,
      },
    ],
    dynamicSecondaryShapeFiles: [
      {
        url: '/shapes/australia-dzn-2021-nsw.json',
        bbox: [
          [141, -37.5],
          [154, -28],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2021-vic.json',
        bbox: [
          [141, -39],
          [151, -34],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2021-qld.json',
        bbox: [
          [138, -29],
          [153, -10],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2021-wa.json',
        bbox: [
          [112, -35],
          [129, -12],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2021-sa.json',
        bbox: [
          [129, -38],
          [141, -26],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2021-tas.json',
        bbox: [
          [143, -44],
          [149, -39],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2021-nt.json',
        bbox: [
          [129, -26],
          [138, -10],
        ],
        zoom: 5,
      },
    ],
    dataset2ShapeFile: '/shapes/australia-sa2-2016-truncated.json',
    dataset2SecondaryShapeFile: '/shapes/australia-dzn-2016-truncated.json',
    dataset2DynamicShapeFiles: [
      {
        url: '/shapes/australia-sa2-2016-nsw.json',
        bbox: [
          [141, -37.5],
          [154, -28],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2016-vic.json',
        bbox: [
          [141, -39],
          [151, -34],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2016-qld.json',
        bbox: [
          [138, -29],
          [153, -10],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2016-wa.json',
        bbox: [
          [112, -35],
          [129, -12],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2016-sa.json',
        bbox: [
          [129, -38],
          [141, -26],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2016-tas.json',
        bbox: [
          [143, -44],
          [149, -39],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-sa2-2016-nt.json',
        bbox: [
          [129, -26],
          [138, -10],
        ],
        zoom: 5,
      },
    ],
    dataset2DynamicSecondaryShapeFiles: [
      {
        url: '/shapes/australia-dzn-2016-nsw.json',
        bbox: [
          [141, -37.5],
          [154, -28],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2016-vic.json',
        bbox: [
          [141, -39],
          [151, -34],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2016-qld.json',
        bbox: [
          [138, -29],
          [153, -10],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2016-wa.json',
        bbox: [
          [112, -35],
          [129, -12],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2016-sa.json',
        bbox: [
          [129, -38],
          [141, -26],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2016-tas.json',
        bbox: [
          [143, -44],
          [149, -39],
        ],
        zoom: 6,
      },
      {
        url: '/shapes/australia-dzn-2016-nt.json',
        bbox: [
          [129, -26],
          [138, -10],
        ],
        zoom: 5,
      },
    ],
    initialPosition: [133, -25, 4],
    isModeGraphsEnabled: true,
    isMapAreaLabelsEnabled: false,
    canMultiSelect: true,
    segments: ['2021-sa2', '2021-dzn', '2016-sa2', '2016-dzn'],
    detailsControls: ['SA2', 'DZN', 'TZ'],
    detailsSecondaryControls: ['2021', '2016'],
    brandingClass: 'ason',
  },
  aucklandcouncil: {
    shapeFile: useSa3
      ? '/shapes/akl-sa3-2023-optimized.json'
      : '/shapes/akl-sa2-2023-optimized.json',
    initialPosition: [174.77, -36.85, 8],
    isModeGraphsEnabled: false,
    mapAreaLabelsToggleValue: false,
    canMultiSelect: true,
    isMapAreaLabelsEnabled: 'name',
    segments: useSa3
      ? [
          '2023-sa2-home-work-walk|2023-sa2-home-work-ride|2023-sa2-home-work-car|2023-sa2-home-work-pt|2023-sa2-home-work-bike|2023-sa2-home-leisure-walk|2023-sa2-home-leisure-ride|2023-sa2-home-leisure-car|2023-sa2-home-leisure-pt|2023-sa2-home-leisure-bike|2023-sa2-home-education-walk|2023-sa2-home-education-ride|2023-sa2-home-education-car|2023-sa2-home-education-pt|2023-sa2-home-education-bike|2023-sa2-home-shop-walk|2023-sa2-home-shop-ride|2023-sa2-home-shop-car|2023-sa2-home-shop-pt|2023-sa2-home-shop-bike|2023-sa2-home-other-walk|2023-sa2-home-other-ride|2023-sa2-home-other-car|2023-sa2-home-other-pt|2023-sa2-home-other-bike|2023-sa2-work-work-walk|2023-sa2-work-work-ride|2023-sa2-work-work-car|2023-sa2-work-work-pt|2023-sa2-work-work-bike|2023-sa2-work-leisure-walk|2023-sa2-work-leisure-ride|2023-sa2-work-leisure-car|2023-sa2-work-leisure-pt|2023-sa2-work-leisure-bike|2023-sa2-work-education-walk|2023-sa2-work-education-ride|2023-sa2-work-education-car|2023-sa2-work-education-pt|2023-sa2-work-education-bike|2023-sa2-work-shop-walk|2023-sa2-work-shop-ride|2023-sa2-work-shop-car|2023-sa2-work-shop-pt|2023-sa2-work-shop-bike|2023-sa2-work-other-walk|2023-sa2-work-other-ride|2023-sa2-work-other-car|2023-sa2-work-other-pt|2023-sa2-work-other-bike|2023-sa2-education-work-walk|2023-sa2-education-work-ride|2023-sa2-education-work-car|2023-sa2-education-work-pt|2023-sa2-education-work-bike|2023-sa2-education-leisure-walk|2023-sa2-education-leisure-ride|2023-sa2-education-leisure-car|2023-sa2-education-leisure-pt|2023-sa2-education-leisure-bike|2023-sa2-education-education-walk|2023-sa2-education-education-ride|2023-sa2-education-education-car|2023-sa2-education-education-pt|2023-sa2-education-education-bike|2023-sa2-education-shop-walk|2023-sa2-education-shop-ride|2023-sa2-education-shop-car|2023-sa2-education-shop-pt|2023-sa2-education-shop-bike|2023-sa2-education-other-walk|2023-sa2-education-other-ride|2023-sa2-education-other-car|2023-sa2-education-other-pt|2023-sa2-education-other-bike|2023-sa2-leisure-work-walk|2023-sa2-leisure-work-ride|2023-sa2-leisure-work-car|2023-sa2-leisure-work-pt|2023-sa2-leisure-work-bike|2023-sa2-leisure-leisure-walk|2023-sa2-leisure-leisure-ride|2023-sa2-leisure-leisure-car|2023-sa2-leisure-leisure-pt|2023-sa2-leisure-leisure-bike|2023-sa2-leisure-education-walk|2023-sa2-leisure-education-ride|2023-sa2-leisure-education-car|2023-sa2-leisure-education-pt|2023-sa2-leisure-education-bike|2023-sa2-leisure-shop-walk|2023-sa2-leisure-shop-ride|2023-sa2-leisure-shop-car|2023-sa2-leisure-shop-pt|2023-sa2-leisure-shop-bike|2023-sa2-leisure-other-walk|2023-sa2-leisure-other-ride|2023-sa2-leisure-other-car|2023-sa2-leisure-other-pt|2023-sa2-leisure-other-bike|2023-sa2-shop-work-walk|2023-sa2-shop-work-ride|2023-sa2-shop-work-car|2023-sa2-shop-work-pt|2023-sa2-shop-work-bike|2023-sa2-shop-leisure-walk|2023-sa2-shop-leisure-ride|2023-sa2-shop-leisure-car|2023-sa2-shop-leisure-pt|2023-sa2-shop-leisure-bike|2023-sa2-shop-education-walk|2023-sa2-shop-education-ride|2023-sa2-shop-education-car|2023-sa2-shop-education-pt|2023-sa2-shop-education-bike|2023-sa2-shop-shop-walk|2023-sa2-shop-shop-ride|2023-sa2-shop-shop-car|2023-sa2-shop-shop-pt|2023-sa2-shop-shop-bike|2023-sa2-shop-other-walk|2023-sa2-shop-other-ride|2023-sa2-shop-other-car|2023-sa2-shop-other-pt|2023-sa2-shop-other-bike|2023-sa2-other-work-walk|2023-sa2-other-work-ride|2023-sa2-other-work-car|2023-sa2-other-work-pt|2023-sa2-other-work-bike|2023-sa2-other-leisure-walk|2023-sa2-other-leisure-ride|2023-sa2-other-leisure-car|2023-sa2-other-leisure-pt|2023-sa2-other-leisure-bike|2023-sa2-other-education-walk|2023-sa2-other-education-ride|2023-sa2-other-education-car|2023-sa2-other-education-pt|2023-sa2-other-education-bike|2023-sa2-other-shop-walk|2023-sa2-other-shop-ride|2023-sa2-other-shop-car|2023-sa2-other-shop-pt|2023-sa2-other-shop-bike|2023-sa2-other-other-walk|2023-sa2-other-other-ride|2023-sa2-other-other-car|2023-sa2-other-other-pt|2023-sa2-other-other-bike',
        ]
      : [
          '2018-sa2-home-work-walk|2018-sa2-home-work-ride|2018-sa2-home-work-car|2018-sa2-home-work-pt|2018-sa2-home-work-bike|2018-sa2-home-leisure-walk|2018-sa2-home-leisure-ride|2018-sa2-home-leisure-car|2018-sa2-home-leisure-pt|2018-sa2-home-leisure-bike|2018-sa2-home-education-walk|2018-sa2-home-education-ride|2018-sa2-home-education-car|2018-sa2-home-education-pt|2018-sa2-home-education-bike|2018-sa2-home-shop-walk|2018-sa2-home-shop-ride|2018-sa2-home-shop-car|2018-sa2-home-shop-pt|2018-sa2-home-shop-bike|2018-sa2-home-other-walk|2018-sa2-home-other-ride|2018-sa2-home-other-car|2018-sa2-home-other-pt|2018-sa2-home-other-bike|2018-sa2-work-work-walk|2018-sa2-work-work-ride|2018-sa2-work-work-car|2018-sa2-work-work-pt|2018-sa2-work-work-bike|2018-sa2-work-leisure-walk|2018-sa2-work-leisure-ride|2018-sa2-work-leisure-car|2018-sa2-work-leisure-pt|2018-sa2-work-leisure-bike|2018-sa2-work-education-walk|2018-sa2-work-education-ride|2018-sa2-work-education-car|2018-sa2-work-education-pt|2018-sa2-work-education-bike|2018-sa2-work-shop-walk|2018-sa2-work-shop-ride|2018-sa2-work-shop-car|2018-sa2-work-shop-pt|2018-sa2-work-shop-bike|2018-sa2-work-other-walk|2018-sa2-work-other-ride|2018-sa2-work-other-car|2018-sa2-work-other-pt|2018-sa2-work-other-bike|2018-sa2-education-work-walk|2018-sa2-education-work-ride|2018-sa2-education-work-car|2018-sa2-education-work-pt|2018-sa2-education-work-bike|2018-sa2-education-leisure-walk|2018-sa2-education-leisure-ride|2018-sa2-education-leisure-car|2018-sa2-education-leisure-pt|2018-sa2-education-leisure-bike|2018-sa2-education-education-walk|2018-sa2-education-education-ride|2018-sa2-education-education-car|2018-sa2-education-education-pt|2018-sa2-education-education-bike|2018-sa2-education-shop-walk|2018-sa2-education-shop-ride|2018-sa2-education-shop-car|2018-sa2-education-shop-pt|2018-sa2-education-shop-bike|2018-sa2-education-other-walk|2018-sa2-education-other-ride|2018-sa2-education-other-car|2018-sa2-education-other-pt|2018-sa2-education-other-bike|2018-sa2-leisure-work-walk|2018-sa2-leisure-work-ride|2018-sa2-leisure-work-car|2018-sa2-leisure-work-pt|2018-sa2-leisure-work-bike|2018-sa2-leisure-leisure-walk|2018-sa2-leisure-leisure-ride|2018-sa2-leisure-leisure-car|2018-sa2-leisure-leisure-pt|2018-sa2-leisure-leisure-bike|2018-sa2-leisure-education-walk|2018-sa2-leisure-education-ride|2018-sa2-leisure-education-car|2018-sa2-leisure-education-pt|2018-sa2-leisure-education-bike|2018-sa2-leisure-shop-walk|2018-sa2-leisure-shop-ride|2018-sa2-leisure-shop-car|2018-sa2-leisure-shop-pt|2018-sa2-leisure-shop-bike|2018-sa2-leisure-other-walk|2018-sa2-leisure-other-ride|2018-sa2-leisure-other-car|2018-sa2-leisure-other-pt|2018-sa2-leisure-other-bike|2018-sa2-shop-work-walk|2018-sa2-shop-work-ride|2018-sa2-shop-work-car|2018-sa2-shop-work-pt|2018-sa2-shop-work-bike|2018-sa2-shop-leisure-walk|2018-sa2-shop-leisure-ride|2018-sa2-shop-leisure-car|2018-sa2-shop-leisure-pt|2018-sa2-shop-leisure-bike|2018-sa2-shop-education-walk|2018-sa2-shop-education-ride|2018-sa2-shop-education-car|2018-sa2-shop-education-pt|2018-sa2-shop-education-bike|2018-sa2-shop-shop-walk|2018-sa2-shop-shop-ride|2018-sa2-shop-shop-car|2018-sa2-shop-shop-pt|2018-sa2-shop-shop-bike|2018-sa2-shop-other-walk|2018-sa2-shop-other-ride|2018-sa2-shop-other-car|2018-sa2-shop-other-pt|2018-sa2-shop-other-bike|2018-sa2-other-work-walk|2018-sa2-other-work-ride|2018-sa2-other-work-car|2018-sa2-other-work-pt|2018-sa2-other-work-bike|2018-sa2-other-leisure-walk|2018-sa2-other-leisure-ride|2018-sa2-other-leisure-car|2018-sa2-other-leisure-pt|2018-sa2-other-leisure-bike|2018-sa2-other-education-walk|2018-sa2-other-education-ride|2018-sa2-other-education-car|2018-sa2-other-education-pt|2018-sa2-other-education-bike|2018-sa2-other-shop-walk|2018-sa2-other-shop-ride|2018-sa2-other-shop-car|2018-sa2-other-shop-pt|2018-sa2-other-shop-bike|2018-sa2-other-other-walk|2018-sa2-other-other-ride|2018-sa2-other-other-car|2018-sa2-other-other-pt|2018-sa2-other-other-bike',
        ],
    detailsControls: [],
    detailsSecondaryControls: [],
    brandingClass: 'aucklandcouncil',
  },
  wsp: {
    title: 'WSP Commuter',
    shapeFile: '/shapes/wsp-zones-optimized.json',
    initialPosition: [172.5, -43.53, 9.5],
    isModeGraphsEnabled: false,
    mapAreaLabelsToggleValue: true,
    canMultiSelect: true,
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
