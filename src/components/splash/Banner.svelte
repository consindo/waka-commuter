<script>
  import expand from '/static/expand.svg'
  let { dataSource, background } = $props()
</script>

<div class="splash-bg" style={`background-image: ${background}`}>
  <div class="splash-content">
    <h2>Commuter Waka – Explore how we travel</h2>
    <p class="mobile">
      Discover how we get around, using travel data from the {dataSource}.
    </p>
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
    background-position: 50% 75%;
    height: 315px;
    padding: 4rem 1.25rem;
    box-sizing: border-box;
    align-items: center;

    @media (max-width: 1020px) {
      background-image:
        linear-gradient(
          rgba(255, 255, 255, 0.8) 0%,
          rgba(255, 255, 255, 0.8) 100%
        ),
        url('/static/css/splash.avif');
    }
  }

  :global(.dark) .splash-bg {
    background-image:
      linear-gradient(
        0deg,
        var(--surface-bg) 0%,
        rgba(0, 0, 0, 0.5) 30%,
        rgba(0, 0, 0, 0.05) 75%
      ),
      url('/static/css/splash-dark.avif');

    @media (max-width: 1020px) {
      background-image:
        linear-gradient(rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.75) 100%),
        url('/static/css/splash-dark.avif');
    }

    @media (min-width: 1651px) {
      background-position: 50% 45%;
    }
  }

  h2 {
    font-size: 1.75rem;
    margin: 13.5rem 0 0;
  }
  p {
    margin: 0 1.25rem 1rem;
    font-size: 1rem;
    max-width: 600px;
    line-height: 1.35;
    position: relative;
    top: 0;
  }
  p.mobile {
    display: none;
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
      padding: 0.75rem 0.75rem;
      display: flex;
      height: 103px;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    h2 {
      margin: 0.25rem 0 0.25rem;
      font-size: 1.125rem;
    }
    p {
      display: none;
    }
    p.mobile {
      display: block;
      margin: 0 0.25rem 0 0;
      font-size: 0.85rem;
    }
    .desktop {
      display: none;
    }
    .splash-content {
      flex: 1;
    }
  }
  @media (max-width: 800px) {
    .splash-controls {
      display: block;
    }
    h2 {
      font-size: 1rem;
    }
  }
</style>
