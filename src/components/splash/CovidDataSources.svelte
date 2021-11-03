<script>
  import Footer from '../details/Footer.svelte'
</script>

<div>
  <Footer />
  <h3>Data Sources</h3>
  <p>
    This app uses our vaccination data from the <a
      href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-vaccine-data/covid-19-vaccination-uptake-rates-across-nz"
      >Ministry of Health</a
    >
    and data from the <a href="https://commuter.waka.app">2018 Census</a>. The
    vaccination information is as 11:59pm on 2 November 2021.
  </p>
  <ul>
    <li>
      Vaccine uptake between the map and detailed breakdown may slightly differ,
      due to standard privacy procedures
    </li>
    <li>
      Some areas have vaccination counts that are higher than the anticipated
      population count due to population movements
    </li>
    <li>
      Some records are not able to be mapped to a location and are not shown in
      this app
    </li>
  </ul>
  <p>
    App not loading? Make sure you’re using the latest version of
    <a href="https://firefox.com">Firefox</a>,
    <a href="https://www.microsoft.com/en-us/edge">Edge</a>, or
    <a href="https://www.google.com/chrome/">Chrome</a>. If you’re still having
    issues, reach out on
    <a href="https://twitter.com/consindo">Twitter</a>.
  </p>
</div>
<footer><a href="https://jono.nz">&copy; 2021 Jono Cooper</a></footer>

<style>
  div {
    padding: 1rem 0 0.5rem;
  }

  p {
    padding: 0 var(--sidebar-padding);
    line-height: 1.35;
  }

  a {
    color: #90caf9;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  footer {
    padding: 0 var(--sidebar-padding) 3rem;
  }
  footer a {
    color: #999;
    text-decoration: none;
    font-size: 0.85rem;
  }
</style>
