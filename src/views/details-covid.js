const calculatePercentage = (population, fraction) => {
  const num = (fraction / population) * 100
  if (num < 0) {
    return '0%'
  } else if (num > 100) {
    return '100%'
  }
  return num.toFixed(1) + '%'
}

export const getCovidHtml = (
  populationCount,
  dose1Count,
  dose2Count,
  title
) => {
  const severity = ((populationCount - dose1Count) / populationCount) * 100

  return `
    ${title ? `<h4>${title}</h4>` : ''}
    <div class="covid-container">
    <div class="unvaccinated ${
      severity > 10 ? (severity > 20 ? 'dire' : 'bad') : ''
    }">
      <strong>${calculatePercentage(
        populationCount,
        populationCount - dose1Count
      )}</strong><br>
      Unvaccinated<br>
      <span class="num">(${(
        populationCount - dose1Count
      ).toLocaleString()})</span>
    </div>
    <div class="doses">
      <p><strong>${calculatePercentage(
        populationCount,
        dose1Count
      )}</strong> 1<sup>st</sup> doses (${dose1Count.toLocaleString()})</p>
      <p><strong>${calculatePercentage(
        populationCount,
        dose2Count
      )}</strong> 2<sup>nd</sup> doses (${dose2Count.toLocaleString()})</p>
    </div>
    </div>
    `
}
