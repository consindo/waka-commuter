const colors = [
  'interpolate-hcl',
  ['linear'],
  ['feature-state', 'population'],
  -250,
  '#0D47A1',
  -50,
  '#2196F3',
  -10,
  '#E3F2FD',
  0,
  '#fff',
  10,
  '#FFEBEE',
  50,
  '#F44336',
  250,
  '#B71C1C',
]

export const areaFill = {
  'fill-outline-color': 'rgba(0,0,0,0)',
  'fill-opacity': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    0.75,
    [
      'interpolate',
      ['linear'],
      ['feature-state', 'magnitude'],
      0,
      0,
      25,
      0.8,
      100,
      0.9,
      200,
      0.95,
      500,
      1,
    ],
  ],
  'fill-color': [
    'case',
    ['!=', ['feature-state', 'population'], null],
    colors,
    [
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
  'circle-stroke-color': 'white',
  'circle-stroke-width': 1,
  // Transition from heatmap to circle layer by zoom level
  'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
}
