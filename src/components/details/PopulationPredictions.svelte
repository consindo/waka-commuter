<script>
  export let population

  let rows = [
    'Emp_Wkf_POPD_15+yrs_',
    'UnEmp_Wkf_POPD_15+yrs_',
    'Not_in_Wkf_POPD_15+yrs_',
  ]
  let rowMapping = {
    'Emp_Wkf_POPD_15+yrs_': 'Employed',
    'UnEmp_Wkf_POPD_15+yrs_': 'Unemployed',
    'Not_in_Wkf_POPD_15+yrs_': 'Not in Wkf',
  }
  let columns = [
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2031',
    '2036',
    '2041',
    '2046',
    '2051',
    '2056',
    '2061',
    '2066',
  ]
</script>

<div class="container">
  <table>
    <tr>
      <th></th>
      {#each columns as column}
        <th>{column}</th>
      {/each}
    </tr>
    {#each rows as row}
      <tr>
        <th title={row}>{rowMapping[row]}</th>
        {#each columns as column}
          <td>{population[row + column].toFixed(1)}</td>
        {/each}
      </tr>
    {/each}
    <tr>
      <th>Total</th>
      {#each columns as column}
        <td
          >{rows
            .reduce((acc, row) => acc + population[row + column], 0)
            .toFixed(1)}</td
        >
      {/each}
    </tr>
  </table>
</div>

<style>
  .container {
    width: 100%;
    overflow-x: scroll;
    box-sizing: border-box;
    padding: 0.5em 0 1em;
    margin-bottom: 1em;
  }
  table {
    font-size: 14px;
    border-collapse: collapse;
  }
  tr th:first-child {
    position: sticky;
    left: 0;
    padding-left: 18px;
    padding-right: 8px;
    background: #111;
  }
  th,
  td {
    text-align: right;
    padding: 3px 6px;
  }
  th:nth-child(even),
  td:nth-child(even) {
    background: #333;
  }
  tr:last-child td {
    border-top: 1px solid #888;
  }
</style>
