import { getSource } from '../../sources.js'
import { humanRegionName } from '../../data.js'

export const getVars = ({
  currentRegions,
  destinationData,
  segment,
  modeData,
}) => {
  const place = humanRegionName(currentRegions, 'full')
  const placeReduced = humanRegionName(currentRegions, 'condensed')

  let regionCount = 0
  let travellersCount = 0
  let travellersPercentage = 0
  let residentsCount = 0
  let residentsPercentage = 0
  let topRegion = ''
  let topRegionCount = 0
  let topRegionPercentage = 0
  destinationData.forEach((row) => {
    if (currentRegions.includes(row.key)) {
      residentsCount += row.value
      residentsPercentage += row.percentage
    } else {
      // don't include the region if it's less than 1
      if (row.value >= 1) {
        regionCount += 1
      }
      travellersCount += row.value
      travellersPercentage += row.percentage

      if (row.value > topRegionCount) {
        topRegion = row.key
        topRegionCount = row.value
        topRegionPercentage = row.percentage
      }
    }
  })
  travellersPercentage = Math.round(travellersPercentage * 100)
  residentsPercentage = Math.round(residentsPercentage * 100)
  topRegionPercentage = Math.round(topRegionPercentage * 100)

  let destination = ['work', 'school']
  if (segment.includes('workplace')) {
    destination = ['work']
  } else if (segment.includes('education')) {
    destination = ['school']
  }

  const source = getSource()
  if (source.brandingClass === 'wsp') {
    destination = []
  } else if (source.brandingClass === 'ason') {
    destination = ['work']
  }

  let popularMode = null
  let popularPercentage = -1 // will prevent it from showing
  if (modeData != null) {
    const searchObj = modeData.Total
    popularMode = Object.keys(searchObj)
      .filter(
        (key) =>
          key !== 'Total' &&
          key !== 'Not applicable' &&
          key !== 'Worked at home' &&
          key !== 'Did not go to work' &&
          key !== 'Not stated'
      )
      .reduce((a, b) => (searchObj[a] > searchObj[b] ? a : b), '')

    popularPercentage =
      searchObj.Total === 0
        ? -1
        : Math.round((searchObj[popularMode] / searchObj.Total) * 100)
  }

  return {
    travellersCount,
    travellersPercentage,
    residentsCount,
    residentsPercentage,
    regionCount,
    topRegion,
    topRegionCount,
    topRegionPercentage,
    place,
    placeReduced,
    destination,
    popularMode,
    popularPercentage,
  }
}
