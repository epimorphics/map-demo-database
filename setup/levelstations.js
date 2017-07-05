

const request = require('superagent');
const _ = require('lodash');

const API_ROOT = '//environment.data.gov.uk';
const STATIONS_ENDPOINT = '/flood-monitoring/id/stations';

function getJSON(apiPath) {
  const protocol = 'https:';
  const api = protocol + API_ROOT + apiPath;
  const reqPromise = request
    .get(api)
    .query({ _view: 'full' })
    .accept('application/json');
  return reqPromise;
}

getJSON(STATIONS_ENDPOINT)
  .then((resultItems) => {
    _.map(resultItems.body.items, (item) => {
      if (item.measures) {
        item.measures.map((measure) => {
          if (measure.parameterName === 'Water Level' && measure.qualifier === 'Stage' && item.stageScale && measure.period === 900 && measure.unitName === 'mASD') {
            console.log(`"${item.label}",${item.lat},${item.long},${item.stationReference}`);
          }
        });
      }
    });
  });

