<script>
  import Dispatcher from '../../dispatcher.js'
  import { getSource } from '../../sources.js'

  const source = getSource()

  let { regionNames } = $props()

  let ctrlKey = false
  let metaKey = false

  let inputValue = $state('')

  // this is because the html datalist does not support a fuzzy search with macrons
  // so we just have to remove them from the search ui
  const removeSpecialCharacters = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  const onKeyPress = (e) => {
    if (e.ctrlKey !== undefined) ctrlKey = e.ctrlKey
    if (e.metaKey !== undefined) metaKey = e.metaKey
    if (e.keyCode === 27) e.currentTarget.blur()
  }

  const onSearch = async (e) => {
    const data = await regionNames
    if (e.currentTarget === null) return
    const value = inputValue

    // checks to make sure they used a precanned one
    const match = data.find(
      (region) => removeSpecialCharacters(region.name) === value
    )
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
      if (
        (source.canMultiSelect && ctrlKey) ||
        (source.canMultiSelect && metaKey) ||
        Dispatcher.currentRegion.includes(match.id)
      ) {
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
    bind:value={inputValue}
    list="search-choice"
    placeholder="Search areas..."
    onselect={onSearch}
    onchange={onSearch}
    onkeydown={onKeyPress}
    onkeyup={onKeyPress}
    onfocus={onFocus}
  />
  <datalist id="search-choice">
    {#each regions as region}
      <option value={removeSpecialCharacters(region.name)}></option>{/each}
  </datalist>
{/await}

<style>
  input {
    background: var(--surface-bg);
    color: var(--surface-text);
    font-family: 'Fira Sans';
    font-size: 15px;
    padding: 0.35rem 0.5rem;
    width: 200px;
    border: 1px solid transparent;
    margin-bottom: 3px;
    outline: 0;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
  input:focus {
    background: var(--surface-bg);
    border-color: var(--surface-text-interactive);
  }
</style>
