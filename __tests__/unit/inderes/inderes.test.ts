import nock = require ('nock');
import { InderesClient } from '../../../src/inderes/inderes';

afterEach( () => {
  nock.cleanAll();
});

const baseURL = 'https://www.inderes.fi/fi';
import inderesResponse from './responses/inderes_numbers_recommendations.json';

describe('getAnalyses', () => {
  const client = new InderesClient();

  test('should return array of company analyses', async () => {
    nock(baseURL)
      .get('/rest/inderes_numbers_recommendations.json')
      .reply(200, JSON.stringify(inderesResponse));
    expect(await client.getAnalyses()).toEqual(Object.values(inderesResponse));
  });

});
