<div>
  <h3>What’s new in Commuter Waka?</h3>
  <p>
    Commuter Waka has recently been updated with new data from the 2023 Census.
    You can toggle between the Census years, or see change with new comparison
    visualisations.
  </p>
  <p>
    We’ve also made the app more accessible with light/dark mode, optional map
    labels, keyboard shortcuts, improved loading speeds, and optimized the
    experience on mobile devices.
  </p>
  <details>
    <summary>Keyboard Shortcuts</summary>
    <p>
      Use the <kbd>Tab</kbd> key to navigate between elements in the app, or use
      the following keyboard shortcuts to quickly filter.
    </p>
    <ul>
      <li><kbd>/</kbd><span><strong>Search Regions</strong></span></li>
      <li><kbd>L</kbd><span>Toggle <strong>Map Labels</strong></span></li>
      <li>
        <kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span
          >Toggle between <strong>All/Arrivals/Departures</strong></span
        >
      </li>
      <li>
        <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><span
          >Toggle between <strong>2023/2018/Comparison</strong></span
        >
      </li>
      <li>
        <kbd>W</kbd><kbd>E</kbd><span
          >Toggle between <strong>Workplace/Education</strong></span
        >
      </li>
      <li>
        <kbd>F</kbd><span>Open <strong>Filter by mode</strong> menu</span><br
        /><br />
      </li>
      <li>
        Use <kbd>M</kbd> to <strong>focus the map</strong> and then use:
        <ul>
          <li>
            <kbd>&uparrow;</kbd><kbd>&downarrow;</kbd><kbd>&larr;</kbd><kbd
              >&rarr;</kbd
            ><span><strong>Pan the map</strong></span>
          </li>
          <li>
            <kbd>+</kbd><kbd>=</kbd><span
              >Increase/decrease <strong>zoom level</strong></span
            >
          </li>
          <li>
            <kbd>Shift+&larr;</kbd><kbd>Shift+&rarr;</kbd><span
              ><strong>Rotate left/right</strong></span
            >
          </li>
          <li>
            <kbd>Shift+&uparrow;</kbd><kbd>Shift+&downarrow;</kbd><span
              ><strong>Tilt up/down</strong></span
            >
          </li>
        </ul>
      </li>
    </ul>
  </details>
  <h3>Data Sources</h3>
  <p>
    For an accessible version of this data, please email
    <a href="mailto:info@stats.govt.nz">info@stats.govt.nz</a>.
  </p>
  <p>
    This app is built with data from the 2023 & 2018 Census. It primarily uses
    the
    <a
      href="https://datafinder.stats.govt.nz/data/category/census/2023/commuter-dataset/"
      >commuter dataset</a
    >, as well as aggregates from the
    <a
      href="https://explore.data.stats.govt.nz/vis?tm=Totals%20by%20topic%20for%20individuals&pg=0&hc%5B2023%20Census%5D=Totals%20by%20topic&snb=3&df%5Bds%5D=ds-nsiws-disseminate&df%5Bid%5D=CEN23_TBT_008&df%5Bag%5D=STATSNZ&df%5Bvs%5D=1.0&dq=rc+pc+asTotal5Y+asMed+biTotal+bpTotal+egTotal+mdTotal+lsTotal+liTotal+geTotal+sbTotal+rbTotal+rsTotal+psTotal+cbTotal+cbmea+raTotal+csTotal+diTotal+dcTotal+dhTotal+drTotal+dsTotal+dwTotal+ddTotal+hoTotal+yuTotal+yumea+yaTotal+yamea+spTotal+teuTotal+teeTotal+hqTotal+qiTotal+piTotal+ibTotal+ibmed+wsTotal+seTotal+upTotal+hwTotal+hwmea+inuTotal+inwTotal+ocuTotal+ocoTotal+twuTotal+twwTotal+soTotal+cdTotal+ctTotal+siTotal+1yTotal+5yTotal+sqTotal+pqTotal+jsTotal.12+13+14+15+16+17+18+99+9999+01+02+03+04+05+06+07+08+09.2013+2018+2023&ly%5Brw%5D=CEN23_TBT_IND_003&ly%5Bcl%5D=CEN23_YEAR_001&ly%5Brs%5D=CEN23_TBT_GEO_006&to%5BTIME%5D=false"
      >totals by topic dataset</a
    >.
  </p>
  <h3>Custom Maps</h3>
  <p>
    Want a custom map for your country, region, or model? Get in touch:
    <a href="mailto:hello@turbomaps.io">hello@turbomaps.io</a>.
  </p>
  <h3>Contributing</h3>
  <p>
    The code for this website is open source on
    <a href="https://github.com/consindo/commuterview">GitHub</a>—contributions
    are welcome!
  </p>
  <p>
    App not loading? Make sure you’re using the latest version of
    <a href="https://firefox.com">Firefox</a>,
    <a href="https://www.microsoft.com/en-us/edge">Edge</a>, or
    <a href="https://www.google.com/chrome/">Chrome</a>.
  </p>
</div>
<footer>
  &copy; 2025 Turbomaps &middot; <a href="https://turbomaps.io">turbomaps.io</a>
</footer>

<style>
  div {
    padding: 0 0 0.5rem;
  }

  h3 {
    margin-top: 1.25em;
  }

  p {
    padding: 0 var(--sidebar-padding);
    line-height: 1.35;
  }

  summary {
    padding: 0 var(--sidebar-padding);
    font-weight: bold;
    cursor: pointer;
  }

  ul {
    list-style-type: none;
    margin: 0.75rem 0;
    padding: 0 calc(var(--sidebar-padding) - 0.125rem);
  }

  li {
    margin-bottom: 0.5rem;
  }

  li span {
    margin-left: 0.5rem;
  }

  kbd {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--surface-gridlines);
    background: var(--surface-bg-subtle);
    margin: 0 0.125rem;
    border-radius: 3px;
    font-weight: bold;
  }

  a {
    color: var(--surface-text-interactive);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  footer {
    padding: 0 var(--sidebar-padding) 3rem;
    color: var(--surface-text-subtle);
    font-size: 0.9rem;
  }
  footer a {
    color: inherit;
  }
</style>
