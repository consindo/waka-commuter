const colors = [
  'case',
  ['==', ['feature-state', 'selected'], 1],
  '#84cc16',
  [
    'interpolate-hcl',
    ['linear'],
    ['feature-state', 'population'],
    -250,
    '#1e40af',
    -50,
    '#2563eb',
    -10,
    '#93c5fd',
    0,
    '#e879f9',
    10,
    '#f87171',
    50,
    '#dc2626',
    250,
    '#991b1b',
  ],
]

const darkColors = [
  'case',
  ['==', ['feature-state', 'selected'], 1],
  '#bef264',
  [
    'interpolate-hcl',
    ['linear'],
    ['feature-state', 'population'],
    -250,
    '#1d4ed8',
    -50,
    '#3b82f6',
    -10,
    '#bae6fd',
    0,
    '#f5d0fe',
    10,
    '#fca5a5',
    50,
    '#ef4444',
    250,
    '#b91c1c',
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
