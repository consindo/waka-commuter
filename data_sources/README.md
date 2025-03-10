# Data Notes

This folder contains the original data exports, and parsers to parse them into a human readable format.

## Sources

### Statistical Area 2 2023 (generalised)

URL: https://datafinder.stats.govt.nz/layer/111227-statistical-area-2-2023-generalised/

- reprojected from NZGD2000 / New Zealand Transverse Mercator 2000 to WGS 84
- converted by Stats NZ Geographic Data Service to Shapefile on 21 Jun 2020 (reference #1939795)
- converted to geojson through https://mapshaper.org/
- using simplify shapes: 10% quality
- run through the optimizer, then back through mapshaper at 1% simplification to create the -small.json

### Main means of travel to work/education

Global URL: <https://explore.data.stats.govt.nz/vis?fs%5B0%5D=Area,0%7CTotal%20-%20New%20Zealand%20by%20regional%20council%239999%23&pg=0&fc=Area&snb=1&df%5Bds%5D=ds-nsiws-disseminate&df%5Bid%5D=CEN23_TBT_008&df%5Bag%5D=STATSNZ&df%5Bvs%5D=1.0&dq=twuTotal+twu001+twu002+twu003+twu004+twu005+twu006+twu007+twu009+twu010+twu012+twu016+twuTS+twu999+twwTotal+tww001+tww002+tww003+tww004+tww005+tww006+tww007+tww009+tww010+tww012+tww016+twwTS+tww999+teuTotal+teeTotal+tee001+tee002+tee003+tee004+tee005+tee006+tee007+tee008+tee009+tee010+teeTS+tee999+teu001+teu002+teu003+teu004+teu005+teu006+teu007+teu008+teu009+teu010+teuTS+teu999..2018+2023&ly%5Brs%5D=CEN23_YEAR_001&ly%5Brw%5D=CEN23_TBT_GEO_006&to%5BTIME%5D=false&tm=travel%20to%20education>
