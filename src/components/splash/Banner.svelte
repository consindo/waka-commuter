<script>
  import expand from '/static/expand.svg'
  export let dataSource, background
</script>

<div class="splash-bg" style={`background-image: ${background}`}>
  <div class="splash-content">
    <h2>Explore how we travel</h2>
    <p>
      Discover how we get around, using travel data from the {dataSource}.
      <span class="desktop"
        >Get started by choosing an area on the map, or jump to a region below.</span
      >
    </p>
  </div>
  <div class="splash-controls">
    <button
      title="Learn More"
      class="btn-expand"
      on:click={() =>
        document.getElementById('app').classList.toggle('map-view')}
    >
      <img alt="Toggle Details" src={expand} />
    </button>
  </div>
</div>

<style>
  .splash-bg {
    background-image: linear-gradient(
        120deg,
        rgba(10, 0, 20, 0.8) 50%,
        rgba(10, 0, 20, 0.4)
      ),
      url('/static/css/splash.jpg');
    background-size: cover;
    background-position: 50% 50%;
    height: 400px;
    padding: 4rem 2.5rem;
    box-sizing: border-box;
  }

  h2 {
    font-size: 3rem;
    margin: 3.5rem 0 1rem;
    text-shadow: 0 1px 3px #000;
  }
  p {
    font-size: 1.35rem;
    text-shadow: 0 1px 2px #000;
    max-width: 600px;
    margin: 0;
    line-height: 1.35;
  }

  .splash-controls {
    display: none;
    width: 24px;
    padding: 0 0.25rem 0 0.25rem;
    text-align: right;
  }
  button {
    border: 0;
    background: transparent;
    font-family: inherit;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    text-align: center;
    padding: 0.25rem;
    margin: 1.25rem 0;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 50%;
    transition: 200ms ease transform;
  }
  button img {
    vertical-align: top;
    width: 24px;
    height: 24px;
  }
  button.btn-close:hover {
    background: #000;
  }
  button.btn-close:active {
    background: #333;
  }

  @media (max-width: 1020px) {
    .splash-bg {
      padding: 1rem 1rem;
      display: flex;
      height: 128px;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    h2 {
      margin: 0.1rem 0 0.25rem;
      font-size: 1.5rem;
    }
    p {
      margin: 0;
      font-size: 0.9rem;
      max-width: 300px;
    }
    .desktop {
      display: none;
    }
    .splash-content {
      flex: 1;
    }
    .splash-controls {
      display: block;
    }
  }
</style>
