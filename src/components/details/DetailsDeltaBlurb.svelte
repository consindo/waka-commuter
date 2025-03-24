<script>
  import { humanRegionName, formatPercentage } from '../../data.js'

  const {
    currentRegions,
    segment,
    arrivals,
    departures,
    arrivalModeData,
    departureModeData,
  } = $props()

  const getSum = (object) => object.reduce((acc, cur) => acc + cur.value, 0)
  const getPercentage = (object) => {
    const sums = object.reduce(
      (acc, cur) => {
        return [acc[0] + (cur.value || 0), acc[1] + (cur.baseline || 0)]
      },
      [0, 0]
    )
    const percentage = (sums[1] + sums[0]) / sums[1] - 1
    return percentage
  }

  const actualArrivals = $derived(
    arrivals.filter((i) => !currentRegions.includes(i.key))
  )
  const totalArrivals = $derived(getSum(actualArrivals))
  const totalArrivalsPercentage = $derived(getPercentage(actualArrivals))

  const actualResidents = $derived(
    arrivals.filter((i) => currentRegions.includes(i.key))
  )
  const totalResidents = $derived(getSum(actualResidents))
  const totalResidentsPercentage = $derived(getPercentage(actualResidents))

  const actualDepartures = $derived(
    departures.filter((i) => !currentRegions.includes(i.key))
  )
  const totalDepartures = $derived(getSum(actualDepartures))
  const totalDeparturesPercentage = $derived(getPercentage(actualDepartures))

  const wfhIncrease = $derived(
    arrivalModeData[0].Total['Work/study at home'] || 0
  )
  const wfhBaseline = $derived(
    arrivalModeData[1].Total['Work/study at home'] || 0
  )
  const wfhPercentage = $derived((wfhBaseline + wfhIncrease) / wfhBaseline - 1)

  const mode = $derived(
    segment.includes('all')
      ? ['work', 'school']
      : segment.includes('workplace')
        ? ['work']
        : ['school']
  )
</script>

<p>
  In 2023, there were <strong class="arrivals"
    >{Math.abs(totalArrivals).toLocaleString()}
    {totalArrivals >= 0 ? 'more' : 'fewer'}{formatPercentage(
      totalArrivalsPercentage
    )}</strong
  >
  trips to
  <span class="less-emphasis">{humanRegionName(currentRegions, 'full')}</span>
  for {mode.join(' & ').replace('school', 'school or study')} when compared to 2018.
  The number of people living and {mode
    .join(' & ')
    .replace('work', 'working')
    .replace('school', 'learning')} within
  <span class="less-emphasis"
    >{humanRegionName(currentRegions, 'condensed')}</span
  >
  has
  <strong class="wfh"
    >{totalResidents >= 0 ? 'increased' : 'decreased'} by {Math.abs(
      totalResidents
    ).toLocaleString()}{formatPercentage(totalResidentsPercentage)}</strong
  >, while trips to other areas have
  <strong class="departures"
    >{totalDepartures >= 0 ? 'increased' : 'decreased'} by {Math.abs(
      totalDepartures
    ).toLocaleString()}{formatPercentage(totalDeparturesPercentage)}</strong
  >. The number of people
  <strong
    >{mode.join(' & ').replace('work', 'working').replace('school', 'studying')}
    from home</strong
  >
  in {humanRegionName(currentRegions, 'condensed')} has
  <strong
    >{wfhIncrease >= 0 ? 'increased' : 'decreased'} by {Math.abs(
      wfhIncrease
    ).toLocaleString()}{formatPercentage(wfhPercentage)}</strong
  >.
</p>

<style>
  p {
    padding: 0 var(--sidebar-padding);
    margin: 0 0 1.5rem;
    font-size: 1.125rem;
    line-height: 1.35;
  }
  .wfh {
    color: var(--surface-text-success);
  }
  .departures {
    color: var(--surface-text-danger);
  }
  .arrivals {
    color: var(--surface-text-interactive);
  }
  .less-emphasis {
    color: var(--surface-text-subtle);
  }
</style>
