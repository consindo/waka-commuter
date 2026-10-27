const useSa1 = window.location.search === '?mode=sa1'
const useSa3 = window.location.search === '?mode=sa3'
const useTa = window.location.search === '?mode=ta'

const SCALE_FACTOR = useSa1 ? 0.5 : useTa ? 100 : useSa3 ? 4 : 1

const colors = [
  'case',
  ['==', ['feature-state', 'selected'], 1],
  '#84cc16',
  [
    'case',
    ['>=', ['feature-state', 'magnitude'], 0],
    [
      'interpolate-hcl',
      ['linear'],
      ['feature-state', 'population'],
      -250 * SCALE_FACTOR,
      '#1e40af',
      -50 * SCALE_FACTOR,
      '#2563eb',
      -10 * SCALE_FACTOR,
      '#93c5fd',
      0,
      '#e879f9',
      10 * SCALE_FACTOR,
      '#f87171',
      50 * SCALE_FACTOR,
      '#dc2626',
      250 * SCALE_FACTOR,
      '#991b1b',
    ],
    [
      'interpolate-hcl',
      ['linear'],
      ['feature-state', 'population'],
      -250 * SCALE_FACTOR,
      '#006666',
      -50 * SCALE_FACTOR,
      '#1cb7b7',
      -10 * SCALE_FACTOR,
      '#36e7f4',
      0,
      '#fefce8',
      10 * SCALE_FACTOR,
      '#fef9c3',
      50 * SCALE_FACTOR,
      '#fef08a',
      250 * SCALE_FACTOR,
      '#facc15',
    ],
  ],
]

const darkColors = [
  'case',
  ['==', ['feature-state', 'selected'], 1],
  '#bef264',
  [
    'case',
    ['>=', ['feature-state', 'magnitude'], 0],
    [
      'interpolate-hcl',
      ['linear'],
      ['feature-state', 'population'],
      -250 * SCALE_FACTOR,
      '#1d4ed8',
      -50 * SCALE_FACTOR,
      '#3b82f6',
      -10 * SCALE_FACTOR,
      '#bae6fd',
      0,
      '#f5d0fe',
      10 * SCALE_FACTOR,
      '#fca5a5',
      50 * SCALE_FACTOR,
      '#ef4444',
      250 * SCALE_FACTOR,
      '#b91c1c',
    ],
    [
      'interpolate-hcl',
      ['linear'],
      ['feature-state', 'population'],
      -250 * SCALE_FACTOR,
      '#006666',
      -50 * SCALE_FACTOR,
      '#1cb7b7',
      -10 * SCALE_FACTOR,
      '#36e7f4',
      0,
      '#fefce8',
      10 * SCALE_FACTOR,
      '#fef9c3',
      50 * SCALE_FACTOR,
      '#fef08a',
      250 * SCALE_FACTOR,
      '#facc15',
    ],
  ],
]

const getHoverState = (isDark) => [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)',
  'rgba(0,0,0,0)',
]

const opacity = [
  'interpolate',
  ['linear'],
  ['feature-state', 'magnitude'],
  -500 * SCALE_FACTOR,
  1,
  -200 * SCALE_FACTOR,
  0.95,
  -100 * SCALE_FACTOR,
  0.9,
  -30 * SCALE_FACTOR,
  0.8,
  -15 * SCALE_FACTOR,
  0.5,
  0,
  0,
  15 * SCALE_FACTOR,
  0.5,
  30 * SCALE_FACTOR,
  0.8,
  100 * SCALE_FACTOR,
  0.9,
  200 * SCALE_FACTOR,
  0.95,
  500 * SCALE_FACTOR,
  1,
]

const hoverOpacity = [
  'interpolate',
  ['linear'],
  ['feature-state', 'magnitude'],
  0,
  0.45,
  30 * SCALE_FACTOR,
  0.5,
  500 * SCALE_FACTOR,
  0.7,
]

export const getAreaFill = (isDark) => ({
  'fill-outline-color': 'rgba(0,0,0,0)',
  'fill-opacity': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    hoverOpacity,
    ['case', ['==', ['feature-state', 'selected'], 1], 0.6, opacity],
  ],
  'fill-color': [
    'case',
    ['!=', ['feature-state', 'population'], null],
    isDark ? darkColors : colors,
    getHoverState(isDark),
  ],
})

export const getLineFill = (isDark) => ({
  'line-color': isDark ? '#777' : '#ccc',
  'line-width': 1,
})

export const pointsFill = {
  // Size circle radius by earthquake magnitude and zoom level
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['get', 'magnitude'],
    1,
    1,
    1000 * SCALE_FACTOR,
    30,
  ],

  'circle-color': 'rgba(255,255,255,0.1)',
  'circle-stroke-color': 'rgba(255,255,255,0.5)',
  'circle-stroke-width': 1,
  // Transition from heatmap to circle layer by zoom level
  'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
  'circle-stroke-width': ['case', ['<', ['get', 'magnitude'], 1], 0, 1],
}

export const getNetworkFill = (isDark, property) => {
  let noColor = '#ffffff'
  let color0 = isDark ? '#1E0D20' : '#BFC6CB'
  let color1 = isDark ? '#592861' : '#405364'
  let color2 = isDark ? '#773581' : '#001930'
  let step0 = 25
  let step1 = 500
  let step2 = 50000
  if (property === 'volpt') {
    color0 = isDark ? '#001D2F' : '#BFDCEF'
    color1 = isDark ? '#00568E' : '#4096CE'
    color2 = '#0073BD'
    step1 = 50
    step2 = 750
  } else if (property === 'volbike') {
    color0 = isDark ? '#253008' : '#E5F0C7'
    color1 = isDark ? '#709117' : '#B0D157'
    color2 = '#95C11F'
    step1 = 150
    step2 = 500
  }
  return {
    'line-color': [
      'interpolate',
      ['linear'],
      ['get', property],
      0,
      noColor,
      step0,
      color0,
      step1,
      color1,
      step2,
      color2,
    ],
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      9,
      [
        'interpolate',
        ['linear'],
        ['get', property],
        0,
        0,
        step0,
        0,
        step1,
        0,
        step2,
        10,
      ],
      13,
      [
        'interpolate',
        ['linear'],
        ['get', property],
        0,
        0,
        step0,
        1,
        step1,
        2,
        step2,
        30,
      ],
    ],
    'line-opacity': 1,
  }
}
