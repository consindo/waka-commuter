<script>
  import { humanRegionName } from '../../data.js'

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

  const formatPercentage = (number) =>
    `(${Math.round(number * 100)}%${number >= 0 ? '↑' : '↓'})`
</script>

<p>
  In 2023, there were <strong class="arrivals"
    >{Math.abs(totalArrivals).toLocaleString()}
    {totalArrivals >= 0 ? 'more' : 'fewer'}
    {formatPercentage(totalArrivalsPercentage)}</strong
  >
  trips to
  <span class="less-emphasis">{humanRegionName(currentRegions, 'full')}</span>
  for work & school when compared to 2018. The number of people working & learning
  within
  <span class="less-emphasis"
    >{humanRegionName(currentRegions, 'condensed')}</span
  >
  has
  <strong class="wfh"
    >{totalResidents >= 0 ? 'increased' : 'decreased'} by {Math.abs(
      totalResidents
    ).toLocaleString()}
    {formatPercentage(totalResidentsPercentage)}</strong
  >, while trips to other areas have
  <strong class="departures"
    >{totalDepartures >= 0 ? 'increased' : 'decreased'} by {Math.abs(
      totalDepartures
    ).toLocaleString()}
    {formatPercentage(totalDeparturesPercentage)}</strong
  >. The number of people <strong>working & studying from home</strong> in {humanRegionName(
    currentRegions,
    'condensed'
  )} has
  <strong>increased/decreased by x (y%)</strong>.
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
