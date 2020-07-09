# Waka Commuter

[![Netlify Status](https://api.netlify.com/api/v1/badges/366a1f64-192f-4d71-a6d6-3a7a6818b76c/deploy-status)](https://commuter.waka.app)

Waka Commuter is a visualization of the 2018 Census commuter data, built for the [There and back again competition](https://www.stats.govt.nz/2018-census/there-and-back-again-data-visualisation-competition/).

This is competition code, so, well, it's not great. It uses Mapbox GL JS for maps, D3 for the graphs, and lit-element to keep everything from getting too messy. To keep things fast, datasets are pre-processed and served statically, using Netlify.

## Build Instructions

- Set the environment variable `MAPBOX_TOKEN` to your Mapbox Token. You can get a free one from the Mapbox website.
- `npm run build` - to build everything - JS & datasets. You should run this first.
- `npm run process` - to process all the data sets into static json.
- `npm start` for local development
- Check `package.json` for more scripts.

## Deployment

- Every commit to master is deployed to Netlify automatically
- Available at <https://commuter.waka.app>
