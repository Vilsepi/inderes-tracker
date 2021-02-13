import { Analysis, Recommendation, Risk } from '../../../src/inderes/inderesTypes';
import { getDifferenceBetweenDates, guessLinkFromName, isFreshEnough } from '../../../src/inderes/utils';

describe('getDifferenceBetweenDates', () => {
  test('less than half a day', () => {
    const now = new Date('2020-12-21T08:24:00');
    const date_of_recommendation = '21.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(0);
  });

  test('more than half a day', () => {
    const now = new Date('2020-12-21T20:24:00');
    const date_of_recommendation = '21.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(1);
  });

  test('a bit over one day', () => {
    const now = new Date('2020-12-22T08:24:00');
    const date_of_recommendation = '21.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(1);
  });

  test('three days', () => {
    const now = new Date('2020-12-24T09:00:00');
    const date_of_recommendation = '21.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(3);
  });

  test('change of year', () => {
    const now = new Date('2021-01-02T06:00:00');
    const date_of_recommendation = '28.12.2020';
    expect(getDifferenceBetweenDates(date_of_recommendation, now)).toEqual(5);
  });

});

describe('isFreshEnough', () => {
  test('data from friday is fresh enough on monday', () => {
    const now = new Date('2020-12-28T07:00:00');
    const analysis: Analysis = {
      isin: 'FI0009010912',
      name: 'Revenio Group',
      date_of_recommendation: '25.12.2020',
      target_price: '44',
      currency: 'EUR',
      recommendation: Recommendation.Reduce,
      risk_level: Risk.Lower
    };
    expect(isFreshEnough(analysis, now)).toEqual(true);
  });

  test('not fresh enough on tuesday', () => {
    const now = new Date('2020-12-29T04:00:00');
    const analysis: Analysis = {
      isin: 'FI0009010912',
      name: 'Revenio Group',
      date_of_recommendation: '25.12.2020',
      target_price: '44',
      currency: 'EUR',
      recommendation: Recommendation.Reduce,
      risk_level: Risk.Lower
    };
    expect(isFreshEnough(analysis, now)).toEqual(false);
  });

});

describe('guessLinkFromName', () => {
  test('should return correct URLs', async () => {
    expect(guessLinkFromName('Gofore')).toEqual('https://www.inderes.fi/fi/yhtiot/gofore');
    expect(guessLinkFromName('NoHo Partners')).toEqual('https://www.inderes.fi/fi/yhtiot/noho-partners');
    expect(guessLinkFromName('Fiskars Group')).toEqual('https://www.inderes.fi/fi/yhtiot/fiskars-group');
    expect(guessLinkFromName('F-Secure')).toEqual('https://www.inderes.fi/fi/yhtiot/f-secure');
    expect(guessLinkFromName('Oma Säästöpankki')).toEqual('https://www.inderes.fi/fi/yhtiot/oma-saastopankki');
    expect(guessLinkFromName('Metsä Board')).toEqual('https://www.inderes.fi/fi/yhtiot/metsa-board');
    expect(guessLinkFromName('Ahlstrom - Munksjö')).toEqual('https://www.inderes.fi/fi/yhtiot/ahlstrom-munksjo');
    expect(guessLinkFromName('Wärtsilä')).toEqual('https://www.inderes.fi/fi/yhtiot/wartsila');
    expect(guessLinkFromName('UTG Mixing Group')).toEqual('https://www.inderes.fi/fi/yhtiot/utg-mixing-group');
    expect(guessLinkFromName('Ovaro Kiinteistösijoitus')).toEqual('https://www.inderes.fi/fi/yhtiot/ovaro-kiinteistosijoitus');
    expect(guessLinkFromName('Ilkka-Yhtymä')).toEqual('https://www.inderes.fi/fi/yhtiot/ilkka-yhtyma');
    expect(guessLinkFromName('Verkkokauppa.com')).toEqual('https://www.inderes.fi/fi/yhtiot/verkkokauppacom');
  });
});
