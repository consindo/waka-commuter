<script>
  import { getSource } from '../../sources.js'
  const source = getSource()
</script>

{#if source.brandingClass === 'statsnz'}
  <div>
    <p>
      The
      <a
        href="https://datafinder.stats.govt.nz/data/category/census/2023/commuter-view/"
        >Commuter View dataset</a
      >
      is used for the map & bubble visualisations, while the
      <a
        href="https://explore.data.stats.govt.nz/vis?tm=Totals%20by%20topic%20for%20individuals&pg=0&hc%5B2023%20Census%5D=Totals%20by%20topic&snb=3&df%5Bds%5D=ds-nsiws-disseminate&df%5Bid%5D=CEN23_TBT_008&df%5Bag%5D=STATSNZ&df%5Bvs%5D=1.0&dq=rc+pc+asTotal5Y+asMed+biTotal+bpTotal+egTotal+mdTotal+lsTotal+liTotal+geTotal+sbTotal+rbTotal+rsTotal+psTotal+cbTotal+cbmea+raTotal+csTotal+diTotal+dcTotal+dhTotal+drTotal+dsTotal+dwTotal+ddTotal+hoTotal+yuTotal+yumea+yaTotal+yamea+spTotal+teuTotal+teeTotal+hqTotal+qiTotal+piTotal+ibTotal+ibmed+wsTotal+seTotal+upTotal+hwTotal+hwmea+inuTotal+inwTotal+ocuTotal+ocoTotal+twuTotal+twwTotal+soTotal+cdTotal+ctTotal+siTotal+1yTotal+5yTotal+sqTotal+pqTotal+jsTotal.12+13+14+15+16+17+18+99+9999+01+02+03+04+05+06+07+08+09.2013+2018+2023&ly%5Brw%5D=CEN23_TBT_IND_003&ly%5Bcl%5D=CEN23_YEAR_001&ly%5Brs%5D=CEN23_TBT_GEO_006&to%5BTIME%5D=false"
        >totals by topic dataset</a
      >
      is used for the modes of travel, and resident population.
    </p>
  </div>
{:else if source.brandingClass === 'wsp'}
  <div>
    <p>
      This visualisation uses data from the Christchurch Transport Model Version
      18.
    </p>
  </div>
{/if}
<div class="desktop">
  <p>
    <strong>Tip:</strong> Hold down
    <strong
      >{#if navigator.platform === 'MacIntel'}⌘ Cmd{:else}Ctrl{/if}</strong
    > to select multiple areas.
  </p>
</div>
<div class="mobile">
  <p>
    <strong>Tip:</strong> Open this app on a PC to get more detailed insights, and
    to select multiple areas.
  </p>
</div>

<style>
  div {
    padding: 0 var(--sidebar-padding);
    color: #ccc;
  }
  p {
    margin: -0.5rem 0 2rem;
  }
  .mobile {
    display: none;
  }

  a {
    color: #90caf9;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 1020px) {
    .desktop {
      display: none;
    }
    .mobile {
      display: block;
    }
  }
</style>
