import { getSource } from "../../sources"

const source = getSource()

const modeList = [
  { id: 'mode-1', icon: '🚆', name: 'Train' },
  { id: 'mode-2', icon: '🚍', name: 'Bus' },
  { id: 'mode-3', icon: '⛴️', name: 'Ferry' },
  { id: 'mode-4', icon: '🚈', name: 'Tram/light rail' },
  { id: 'mode-5', icon: '🚖', name: 'Taxi/ride-share service' },
  { id: 'mode-6', icon: '🚘', name: 'Car, as driver' },
  { id: 'mode-7', icon: '🚘', name: 'Car, as passenger' },
  { id: 'mode-8', icon: '🚛', name: 'Truck' },
  { id: 'mode-9', icon: '🏍️', name: 'Motorbike/scooter' },
  { id: 'mode-10', icon: '🚲', name: 'Bicycle' },
  { id: 'mode-11', icon: '✈️', name: 'Other mode' },
  { id: 'mode-12', icon: '🚶', name: 'Walked only' },
  { id: 'mode-13', icon: '🏠', name: 'Worked at home' },
  { id: 'mode-14', icon: '🛌', name: 'Did not go to work' },
  { id: 'mode-15', icon: '❓', name: 'Not stated' },
  { id: 'mode-16', icon: '🚫', name: 'Not applicable' },
]

export let modes = modeList
if (source.brandingClass === 'statsnz') {
  modes[5].name = 'Car, truck, or van, as driver'
  modes[6].name = 'Car, truck, van, or company bus as passenger'
  modes[11].name = 'Walk or jog'
  modes[12].name = 'Worked/studied at home'
  modes = modes.filter(i => [
    'mode-1',
    'mode-2',
    'mode-3',
    'mode-6',
    'mode-7',
    'mode-10',
    'mode-11',
    'mode-12',
    'mode-13',
  ].includes(i.id))
}

