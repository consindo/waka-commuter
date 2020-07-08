# Waka Commuter

[![Netlify Status](https://api.netlify.com/api/v1/badges/366a1f64-192f-4d71-a6d6-3a7a6818b76c/deploy-status)](https://app.netlify.com/sites/adoring-cori-f9ace0/deploys)

## Build Instructions

- Set the environment variable `MAPBOX_TOKEN` to your Mapbox Token. You can get a free one from the Mapbox website.
- `npm run build` - to build everything - JS & datasets. You should run this first.
- `npm run process` - to process all the data sets into static json.
- `npm start` for local development
- Check `package.json` for more scripts.

## Deployment

- Every commit to master is deployed to Netlify automatically
- Available at <https://commuter.waka.app>
