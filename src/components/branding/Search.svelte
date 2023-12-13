<script>
  import Dispatcher from '../../dispatcher.js'

  export let regionNames

  let ctrlKey = false
  let metaKey = false

  const onKeyPress = (e) => {
    if (e.ctrlKey !== undefined) ctrlKey = e.ctrlKey
    if (e.metaKey !== undefined) metaKey = e.metaKey
    if (e.keyCode === 27) e.currentTarget.blur()
  }

  const onSearch = async (e) => {
    const data = await regionNames
    if (e.currentTarget === null) return
    const { value } = e.currentTarget

    // checks to make sure they used a precanned one
    const match = data.find((region) => region.name === value)
    if (match) {
      if (match.id.startsWith('TZ')) {
        Dispatcher.dataSegment = Dispatcher.dataSegment.replace(
          /-sa2|-dzn/g,
          '-tz'
        )
      } else if (match.id.startsWith('DZN')) {
        Dispatcher.dataSegment = Dispatcher.dataSegment.replace(
          /-sa2|-tz/g,
          '-dzn'
        )
        Dispatcher.dataDirection = 'arrivals'
      }
      if (ctrlKey || metaKey || Dispatcher.currentRegion.includes(match.id)) {
        Dispatcher.addRegion(match.id)
      } else {
        Dispatcher.setRegions([match.id], true)
      }
      e.currentTarget.blur()
    }
  }

  const onFocus = (e) => (e.currentTarget.value = '')
</script>

{#await regionNames}
  <input placeholder="Loading..." />
{:then regions}
  <input
    list="search-choice"
    placeholder="Search areas..."
    on:select={onSearch}
    on:change={onSearch}
    on:keydown={onKeyPress}
    on:keyup={onKeyPress}
    on:focus={onFocus}
  />
  <datalist id="search-choice">
    {#each regions as region}
      <option value={region.name} />{/each}
  </datalist>
{/await}

<style>
  input {
    background: #222;
    color: #fff;
    font-family: 'Fira Sans';
    font-size: 15px;
    padding: 0.35rem 0.5rem;
    width: 200px;
    border: 1px solid transparent;
    margin-bottom: 3px;
    outline: 0;
    border-radius: 3px;
  }
  input:focus {
    background: #111;
    border-color: #000;
  }
</style>
