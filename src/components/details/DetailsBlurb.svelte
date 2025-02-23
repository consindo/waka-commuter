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
    >{vars.travellersCount}
    {vars.travellersCount === 1 ? 'person' : 'people'} ({vars.travellersPercentage}%
    of {mode})</strong
  >
  travel to
  <span class="less-emphasis">{vars.place}</span>
  for {vars.destination.length > 0 ? vars.destination.join(' & ') : ''}, while
  <strong class="wfh"
    >{vars.residentsCount}
    {vars.residentsCount === 1 ? 'person' : 'people'} ({vars.residentsPercentage}%
    of arrivals)</strong
  >
  {vars.travellersCount > 0 ? 'also' : ''} live {vars.destination.length > 0
    ? `& ${vars.destination.join('/')}`
    : ''} within {vars.placeReduced}. People arrive from
  <strong class={mode}
    >{vars.regionCount} different
    {vars.regionCount === 1 ? 'area' : 'areas'}</strong
  >, the largest external {mode === 'arrivals' ? 'origin' : 'destination'} being
  <strong
    >{humanRegionName([vars.topRegion], 'full')} ({vars.topRegionCount} people—{vars.topRegionPercentage}%
    of {mode})</strong
  >.
  {#if mode === 'arrivals'}
    The most common way to arrive is
  {:else if mode === 'departures'}
    People in {vars.placeReduced} most often depart by
  {/if}
  <strong>{humanMode(vars.popularMode)} ({vars.popularPercentage}%)</strong>.
</p>

<style>
  p {
    padding: 0 var(--sidebar-padding);
    margin: 0 0 1.5rem;
    font-size: 1.125rem;
    line-height: 1.35;
  }
  .wfh {
    color: #badc58;
  }
  .departures {
    color: #f44336;
  }
  .arrivals {
    color: #90caf9;
  }
  .less-emphasis {
    color: #bbb;
  }
</style>
