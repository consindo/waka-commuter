import { getSource } from '../../sources.js'
const source = getSource()

const colors = [
  'case',
  ['==', ['feature-state', 'selected'], 1],
  '#BADC58',
  [
    'interpolate-hcl',
    ['linear'],
    ['feature-state', 'population'],
    -250,
    '#0D47A1',
    -50,
    '#2196F3',
    -10,
    '#BBDEFB',
    0,
    '#BA68C8',
    10,
    '#FFCDD2',
    50,
    '#F44336',
    250,
    '#B71C1C',
  ],
]

const doseColors = [
  0,
  '#ffffcc',
  450,
  '#ffffcc',
  550,
  '#c7e9b4',
  650,
  '#7fcdbb',
  750,
  '#41b6c4',
  850,
  '#2c7fb8',
  950,
  '#253494',
]

const vaccineColors = [
  'case',
  ['==', ['feature-state', 'nullState'], false],
  'rgba(0,0,0,0)',
  [
    'case',
    ['==', ['feature-state', 'nullState'], 'dose2Uptake'],
    ['interpolate-hcl', ['linear'], ['get', 'dose2Uptake'], ...doseColors],
    ['interpolate-hcl', ['linear'], ['get', 'dose1Uptake'], ...doseColors],
  ],
]

const opacity =
  source.vaccineData != null
    ? 0.65
    : [
        'interpolate',
        ['linear'],
        ['feature-state', 'magnitude'],
        0,
        0,
        20,
        0.5,
        30,
        0.8,
        100,
        0.9,
        200,
        0.95,
        500,
        1,
      ]

const hoverOpacity = [
  'interpolate',
  ['linear'],
  ['feature-state', 'magnitude'],
  0,
  0.45,
  30,
  0.6,
  500,
  0.7,
]

export const areaFill = {
  'fill-outline-color': 'rgba(0,0,0,0)',
  'fill-opacity': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    hoverOpacity,
    ['case', ['==', ['feature-state', 'selected'], 1], 0.75, opacity],
  ],
  'fill-color': [
    'case',
    ['!=', ['feature-state', 'population'], null],
    colors,
    source.vaccineData != null
      ? vaccineColors
      : [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(255,255,255,0.45)',
          'rgba(0,0,0,0)',
        ],
  ],
}

export const lineFill = {
  'line-color': '#777',
  'line-width': 1,
}

export const pointsFill = {
  // Size circle radius by earthquake magnitude and zoom level
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['get', 'magnitude'],
    1,
    1,
    1000,
    30,
  ],

  'circle-color': 'rgba(255,255,255,0.1)',
  'circle-stroke-color': 'rgba(255,255,255,0.5)',
  'circle-stroke-width': 1,
  // Transition from heatmap to circle layer by zoom level
  'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
  'circle-stroke-width': ['case', ['<', ['get', 'magnitude'], 1], 0, 1],
}
