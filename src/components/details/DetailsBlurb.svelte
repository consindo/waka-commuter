<script>
  import { getVars } from './DetailsBlurbVars.js'
  import { humanRegionName } from '../../data.js'

  const { currentRegions, segment, destinationData, modeData, mode } = $props()
  const vars = $derived(
    getVars({ currentRegions, destinationData, segment, modeData })
  )

  const humanMode = (message, mode) => {
    const msg = message.toLowerCase()
    if (mode === 'arrivals') {
      if (msg.includes('passenger')) {
        return 'be a ' + msg
      }
    } else {
      if (msg.includes('passenger')) {
        return 'are ' + msg.replace('passenger', 'passengers')
      }
    }
    if (msg.includes('bus') || msg.includes('ferry')) {
      return 'take a ' + msg
    }
    return msg
  }
</script>

<p>
  <strong class={mode}
    >{vars.travellersCount.toLocaleString()}
    {vars.travellersCount === 1 ? 'person' : 'people'} ({isNaN(
      vars.travellersPercentage
    )
      ? 0
      : vars.travellersPercentage}% of {mode})</strong
  >
  travel {mode === 'arrivals' ? 'to' : 'from'}
  <span class="less-emphasis">{vars.place}</span>
  for {vars.destination.length > 0
    ? vars.destination.join(' & ').replace('school', 'school or study')
    : ''}, while
  <strong class="wfh"
    >{vars.residentsCount.toLocaleString()}
    {vars.residentsCount === 1 ? 'person' : 'people'} ({vars.residentsPercentage}%
    of {mode})</strong
  >
  {vars.travellersCount > 0 ? 'also' : ''} live {vars.destination.length > 0
    ? `& ${vars.destination.join('/').replace('school', 'learn')}`
    : ''} within {vars.placeReduced}.
  {#if vars.regionCount > 0}
    People {mode === 'arrivals' ? 'arrive from' : 'travel to'} at least
    <strong class={mode}
      >{vars.regionCount} different
      {vars.regionCount === 1 ? 'area' : 'areas'}</strong
    >, the largest external {mode === 'arrivals' ? 'origin' : 'destination'} being
    <strong
      >{humanRegionName([vars.topRegion], 'full')} ({vars.topRegionCount} people—{vars.topRegionPercentage}%
      of {mode})</strong
    >.
  {:else if mode === 'arrivals'}
    The origin areas of people travelling from outside of <span
      class="less-emphasis">{vars.place}</span
    >
    are not shown because fewer than 6 people travel from each external origin.
  {:else}
    The destination areas of people travelling outside of <span
      class="less-emphasis">{vars.place}</span
    >
    are not shown because fewer than 6 people travel to each external destination.
  {/if}
  {#if !isNaN(vars.popularPercentage) && vars.popularPercentage >= 0}
    {#if mode === 'arrivals'}
      The most common way to arrive is
    {:else if mode === 'departures'}
      The most common way to depart in {vars.placeReduced} is
    {/if}
    <strong>{humanMode(vars.popularMode)} ({vars.popularPercentage}%)</strong>.
  {/if}
</p>

<style>
  p {
    padding: 0 var(--sidebar-padding);
    margin: 0 0 1.5rem;
    font-size: 1.125rem;
    line-height: 1.35;

    @media (max-width: 1020px) {
      font-size: 1rem;
    }
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
