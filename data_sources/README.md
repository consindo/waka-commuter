# Data Notes

This folder contains the original data exports, and parsers to parse them into a human readable format.

## Sources

### Statistical Area 2 2018 (generalised)

URL: https://datafinder.stats.govt.nz/layer/92212-statistical-area-2-2018-generalised/

- reprojected from NZGD2000 / New Zealand Transverse Mercator 2000 to WGS 84
- converted by Stats NZ Geographic Data Service to Shapefile on 21 Jun 2020 (reference #1939795)
- converted to geojson through https://mapshaper.org/
- using simplify shapes: 10% quality
- run through the optimizer, then back through mapshaper at 1% simplification to create the -small.json

### Main means of travel to work and workplace address

URL: http://nzdotstat.stats.govt.nz/WBOS/Index.aspx?DataSetCode=TABLECODE8296#

- selection settings adjusted to include all means of travel to work
- selection settings adjusted to include all areas

### Ethnicity

URL: http://nzdotstat.stats.govt.nz/WBOS/Index.aspx?DataSetCode=TABLECODE8296
