<script>
  import expand from '/static/expand.svg'
  let { dataSource, background } = $props()
</script>

<div class="splash-bg" style={`background-image: ${background}`}>
  <div class="splash-content">
    <h2>Explore how we travel</h2>
  </div>
  <div class="splash-controls">
    <button
      title="Learn More"
      class="btn-expand"
      onclick={() =>
        document.getElementById('app').classList.toggle('map-view')}
    >
      <img alt="Toggle Details" src={expand} />
    </button>
  </div>
</div>
<p>
  Discover how we get around, using travel data from the {dataSource}.
  <span class="desktop"
    >Get started by choosing an area on the map, or jump to a region below.</span
  >
</p>

<style>
  .splash-bg {
    background-image:
      linear-gradient(
        0deg,
        var(--surface-bg) 0%,
        rgba(255, 255, 255, 0.5) 30%,
        rgba(255, 255, 255, 0.05) 100%
      ),
      url('/static/css/splash.avif');
    background-size: cover;
    background-position: 50% 100%;
    height: 315px;
    padding: 4rem 1.25rem;
    box-sizing: border-box;
  }

  @media (prefers-color-scheme: dark) {
    .splash-bg {
      background-image:
        linear-gradient(
          0deg,
          var(--surface-bg) 0%,
          rgba(0, 0, 0, 0.5) 30%,
          rgba(0, 0, 0, 0.05) 100%
        ),
        url('/static/css/splash-dark.avif');
    }
  }

  h2 {
    font-size: 2.25rem;
    margin: 12.5rem 0 0;
  }
  p {
    margin: 0 1.25rem 1rem;
    font-size: 1rem;
    max-width: 600px;
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
