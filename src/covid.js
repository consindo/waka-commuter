export const transformVaccine = (data) => {
  let aggregate = {}
  data.map((dataSource) => {
    Object.keys(dataSource.vaccine).forEach((segment) => {
      if (aggregate[segment] === undefined) {
        aggregate[segment] = {
          dose1Count: 0,
          dose1Uptake: 0,
          dose2Count: 0,
          dose2Uptake: 0,
          populationCount: 0,
        }
      }
      aggregate[segment].dose1Count += dataSource.vaccine[segment].dose1Count
      aggregate[segment].dose2Count += dataSource.vaccine[segment].dose2Count
      aggregate[segment].populationCount +=
        dataSource.vaccine[segment].populationCount
      aggregate[segment].dose1Uptake +=
        dataSource.vaccine[segment].dose1Uptake / data.length
      aggregate[segment].dose2Uptake +=
        dataSource.vaccine[segment].dose2Uptake / data.length
    })
  })
  return aggregate
}

export const transformEthnicity = (data) => {
  console.log(data)
  let aggregate = {}
  data.map((dataSource) => {
    Object.keys(dataSource.ethnicity).forEach((key) => {
      if (aggregate[key] === undefined) {
        aggregate[key] = 0
      }
      aggregate[key] += dataSource.ethnicity[key]
    })
  })
  return aggregate
}
