import sa22023 from '../static/shapes/sa2-2023-optimized.json?url'
import sa22023small from '../static/shapes/sa2-2023-small-optimized.json?url'
import sa32023 from '../static/shapes/sa3-2023-optimized.json?url'
import sa32023small from '../static/shapes/sa3-2023-small-optimized.json?url'

const useSa1 = window.location.search === '?mode=sa1'
const useSa3 = window.location.search === '?mode=sa3'
const useTa = window.location.search === '?mode=ta'

const aklBaseSegment =
  '2018-XXX-home-work-walk|2018-XXX-home-work-ride|2018-XXX-home-work-car|2018-XXX-home-work-pt|2018-XXX-home-work-bike|2018-XXX-home-leisure-walk|2018-XXX-home-leisure-ride|2018-XXX-home-leisure-car|2018-XXX-home-leisure-pt|2018-XXX-home-leisure-bike|2018-XXX-home-education-walk|2018-XXX-home-education-ride|2018-XXX-home-education-car|2018-XXX-home-education-pt|2018-XXX-home-education-bike|2018-XXX-home-shop-walk|2018-XXX-home-shop-ride|2018-XXX-home-shop-car|2018-XXX-home-shop-pt|2018-XXX-home-shop-bike|2018-XXX-home-other-walk|2018-XXX-home-other-ride|2018-XXX-home-other-car|2018-XXX-home-other-pt|2018-XXX-home-other-bike|2018-XXX-work-work-walk|2018-XXX-work-work-ride|2018-XXX-work-work-car|2018-XXX-work-work-pt|2018-XXX-work-work-bike|2018-XXX-work-leisure-walk|2018-XXX-work-leisure-ride|2018-XXX-work-leisure-car|2018-XXX-work-leisure-pt|2018-XXX-work-leisure-bike|2018-XXX-work-education-walk|2018-XXX-work-education-ride|2018-XXX-work-education-car|2018-XXX-work-education-pt|2018-XXX-work-education-bike|2018-XXX-work-shop-walk|2018-XXX-work-shop-ride|2018-XXX-work-shop-car|2018-XXX-work-shop-pt|2018-XXX-work-shop-bike|2018-XXX-work-other-walk|2018-XXX-work-other-ride|2018-XXX-work-other-car|2018-XXX-work-other-pt|2018-XXX-work-other-bike|2018-XXX-education-work-walk|2018-XXX-education-work-ride|2018-XXX-education-work-car|2018-XXX-education-work-pt|2018-XXX-education-work-bike|2018-XXX-education-leisure-walk|2018-XXX-education-leisure-ride|2018-XXX-education-leisure-car|2018-XXX-education-leisure-pt|2018-XXX-education-leisure-bike|2018-XXX-education-education-walk|2018-XXX-education-education-ride|2018-XXX-education-education-car|2018-XXX-education-education-pt|2018-XXX-education-education-bike|2018-XXX-education-shop-walk|2018-XXX-education-shop-ride|2018-XXX-education-shop-car|2018-XXX-education-shop-pt|2018-XXX-education-shop-bike|2018-XXX-education-other-walk|2018-XXX-education-other-ride|2018-XXX-education-other-car|2018-XXX-education-other-pt|2018-XXX-education-other-bike|2018-XXX-leisure-work-walk|2018-XXX-leisure-work-ride|2018-XXX-leisure-work-car|2018-XXX-leisure-work-pt|2018-XXX-leisure-work-bike|2018-XXX-leisure-leisure-walk|2018-XXX-leisure-leisure-ride|2018-XXX-leisure-leisure-car|2018-XXX-leisure-leisure-pt|2018-XXX-leisure-leisure-bike|2018-XXX-leisure-education-walk|2018-XXX-leisure-education-ride|2018-XXX-leisure-education-car|2018-XXX-leisure-education-pt|2018-XXX-leisure-education-bike|2018-XXX-leisure-shop-walk|2018-XXX-leisure-shop-ride|2018-XXX-leisure-shop-car|2018-XXX-leisure-shop-pt|2018-XXX-leisure-shop-bike|2018-XXX-leisure-other-walk|2018-XXX-leisure-other-ride|2018-XXX-leisure-other-car|2018-XXX-leisure-other-pt|2018-XXX-leisure-other-bike|2018-XXX-shop-work-walk|2018-XXX-shop-work-ride|2018-XXX-shop-work-car|2018-XXX-shop-work-pt|2018-XXX-shop-work-bike|2018-XXX-shop-leisure-walk|2018-XXX-shop-leisure-ride|2018-XXX-shop-leisure-car|2018-XXX-shop-leisure-pt|2018-XXX-shop-leisure-bike|2018-XXX-shop-education-walk|2018-XXX-shop-education-ride|2018-XXX-shop-education-car|2018-XXX-shop-education-pt|2018-XXX-shop-education-bike|2018-XXX-shop-shop-walk|2018-XXX-shop-shop-ride|2018-XXX-shop-shop-car|2018-XXX-shop-shop-pt|2018-XXX-shop-shop-bike|2018-XXX-shop-other-walk|2018-XXX-shop-other-ride|2018-XXX-shop-other-car|2018-XXX-shop-other-pt|2018-XXX-shop-other-bike|2018-XXX-other-work-walk|2018-XXX-other-work-ride|2018-XXX-other-work-car|2018-XXX-other-work-pt|2018-XXX-other-work-bike|2018-XXX-other-leisure-walk|2018-XXX-other-leisure-ride|2018-XXX-other-leisure-car|2018-XXX-other-leisure-pt|2018-XXX-other-leisure-bike|2018-XXX-other-education-walk|2018-XXX-other-education-ride|2018-XXX-other-education-car|2018-XXX-other-education-pt|2018-XXX-other-education-bike|2018-XXX-other-shop-walk|2018-XXX-other-shop-ride|2018-XXX-other-shop-car|2018-XXX-other-shop-pt|2018-XXX-other-shop-bike|2018-XXX-other-other-walk|2018-XXX-other-other-ride|2018-XXX-other-other-car|2018-XXX-other-other-pt|2018-XXX-other-other-bike'

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
      ? '/shapes/akl-sa3-2026-optimized.json'
      : useSa1
        ? '/shapes/akl-sa1-2026-optimized.json'
        : useTa
          ? '/shapes/akl-ta-2026-optimized.json'
          : '/shapes/akl-sa2-2026-optimized.json',
    initialPosition: [174.77, -36.85, 8],
    isModeGraphsEnabled: false,
    mapAreaLabelsToggleValue: false,
    canMultiSelect: true,
    isMapAreaLabelsEnabled: 'name',
    segments: [
      useSa3
        ? aklBaseSegment.split('XXX').join('sa3')
        : useSa1
          ? aklBaseSegment.split('XXX').join('sa1')
          : useTa
            ? aklBaseSegment.split('XXX').join('ta')
            : aklBaseSegment.split('XXX').join('sa2'),
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
