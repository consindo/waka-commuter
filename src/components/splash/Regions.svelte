<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let enabledRegions

  const getImageUrl = (name) =>
    new URL(`/static/css/regions/${name}.jpg`, import.meta.url).href

  const regions = [
    {
      id: 'nz-akl',
      primaryName: 'Tāmaki Makaurau',
      secondaryName: 'Auckland',
      lat: '-36.9',
      lng: '174.7',
      zoom: '10.5',
    },
    {
      id: 'nz-chc',
      primaryName: 'Ōtautahi',
      secondaryName: 'Christchurch',
      lat: '-43.5',
      lng: '172.6',
      zoom: '11',
    },
    {
      id: 'nz-wlg',
      primaryName: 'Te Whanganui-a-Tara',
      secondaryName: 'Wellington',
      lat: '-41.2',
      lng: '174.8',
      zoom: '10.5',
    },
    {
      id: 'nz-trg',
      primaryName: 'Tauranga',
      secondaryName: '',
      lat: '-37.7',
      lng: '176.2',
      zoom: '11',
    },
    {
      id: 'nz-hlz',
      primaryName: 'Kirikiriroa',
      secondaryName: 'Hamilton',
      lat: '-37.8',
      lng: '175.3',
      zoom: '11.5',
    },
    {
      id: 'nz-dud',
      primaryName: 'Ōtepoti',
      secondaryName: 'Dunedin',
      lat: '-45.9',
      lng: '170.5',
      zoom: '11',
    },
    {
      id: 'au-syd',
      primaryName: 'Sydney',
      secondaryName: 'New South Wales',
      lat: '-33.8',
      lng: '151.2',
      zoom: '10',
    },
    {
      id: 'au-mel',
      primaryName: 'Melbourne',
      secondaryName: 'Victoria',
      lat: '-37.8',
      lng: '144.9',
      zoom: '10',
    },
    {
      id: 'au-bne',
      primaryName: 'Brisbane',
      secondaryName: 'Queensland',
      lat: '-27.5',
      lng: '153',
      zoom: '10',
    },
    {
      id: 'au-per',
      primaryName: 'Perth',
      secondaryName: 'Western Australia',
      lat: '-31.9',
      lng: '115.8',
      zoom: '10',
    },
    {
      id: 'au-adl',
      primaryName: 'Adelaide',
      secondaryName: 'South Australia',
      lat: '-34.9',
      lng: '138.6',
      zoom: '10.5',
    },
    {
      id: 'au-ool',
      primaryName: 'Gold Coast',
      secondaryName: 'Queensland',
      lat: '-28',
      lng: '153.4',
      zoom: '10.5',
    },
    {
      id: 'au-ntl',
      primaryName: 'Newcastle',
      secondaryName: 'New South Wales',
      lat: '-32.9',
      lng: '151.7',
      zoom: '11.5',
    },
    {
      id: 'au-can',
      primaryName: 'Canberra',
      secondaryName: 'ACT',
      lat: '-35.3',
      lng: '149.1',
      zoom: '11',
    },
    {
      id: 'au-hba',
      primaryName: 'Hobart',
      secondaryName: 'Tasmania',
      lat: '-42.9',
      lng: '147.3',
      zoom: '11',
    },
  ].filter((i) => enabledRegions.includes(i.id))
</script>

<nav>
  {#each regions as region}
    <div
      class="region-option"
      data-lat={region.lat}
      data-lng={region.lng}
      data-zoom={region.zoom}
      on:click={() =>
        dispatch('locationChange', {
          lat: region.lat,
          lng: region.lng,
          zoom: region.zoom,
        })}
    >
      <h3 style="background-image: url({getImageUrl(region.id)})">
        <strong>{region.primaryName}</strong>
        <span>{region.secondaryName}</span>
      </h3>
    </div>
  {/each}
</nav>

<style>
  nav {
    font-size: 0;
    padding: 0.75rem;
  }
  div {
    width: 33.33%;
    display: inline-block;
    padding: 0.5rem;
    box-sizing: border-box;
    vertical-align: top;
  }
  h3 {
    height: 140px;
    padding: 0 0 0.5rem;
    box-sizing: border-box;
    line-height: 1;
    font-size: 0.9rem;
    text-align: center;
    background-color: #222;
    border-radius: 5px;
    font-weight: 300;
    margin: 0;
    transition: 100ms ease transform;
    user-select: none;
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    justify-content: flex-end;
    background-size: cover;
    text-shadow:
      0 1px 1px #000,
      0 0px 3px #000;
  }
  h3:hover {
    transform: scale(1.02);
  }
  h3:active {
    transform: scale(1);
  }
  strong {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
  }
  span {
    display: block;
  }
  @media (max-width: 1650px) {
    div {
      width: 50%;
    }
  }
  @media (max-width: 500px) {
    h3 {
      height: 110px;
    }
  }
</style>
