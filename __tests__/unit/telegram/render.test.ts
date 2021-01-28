import { Recommendation, Risk } from '../../../src/inderes/inderesTypes';
import { guessLinkFromName } from '../../../src/inderes/utils';
import { calculatePotential, renderMessage } from '../../../src/telegram/render';

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

describe('calculatePotential', () => {
  test('should calculate correctly', async () => {
    expect(calculatePotential(100, 200)).toEqual('+100%');
    expect(calculatePotential(20, 80)).toEqual('+300%');
    expect(calculatePotential(10, 13)).toEqual('+30%');
    expect(calculatePotential(8, 4)).toEqual('-50%');
    expect(calculatePotential(1.66, 1)).toEqual('-40%');
    expect(calculatePotential(2.13, 1.30)).toEqual('-39%');
    expect(calculatePotential(0.89, 0.65)).toEqual('-27%');
    expect(calculatePotential(15.76, 13.00)).toEqual('-18%');
    expect(calculatePotential(3.20, 3.20)).toEqual('0%');
    expect(calculatePotential(45.16, 45.00)).toEqual('0%');
  });
});

describe('renderMessage', () => {
  const enrichedAnalysis = {
    isin: 'FI0009800296',
    name: 'Reka Industrial',
    date_of_recommendation: '23.10.2020',
    target_price: '2.5',
    currency: 'EUR',
    recommendation: Recommendation.Reduce,
    risk_level: Risk.Highest,
    label: "Heikommin menee",
    published: "123",
    url: "https://localhost"
  };

  test('should render potential when last price is known', async () => {
    const priceQuote = {
      isin: 'FI0009800296',
      marketplace: 'foo',
      insref: 'foo',
      symbol: 'ABC',
      name: 'Reka Industrial',
      tradecurrency: 'EUR',
      diff1d: '0.0',
      diff1dprc: '0.0',
      bidprice: '3.5',
      askprice: '3.5',
      lastprice: '3.5',
      dayhighprice: '3.5',
      daylowprice: '3.5',
      closeprice1d: '3.5',
      turnover: '1234',
      quantity: '1000',
      timestamp: '1611854536',
      no_last_price: false
    }
    const expectedMessage = "<b>Vähennä <a href=\"https://www.inderes.fi/fi/yhtiot/reka-industrial\">Reka Industrial</a></b>\n" +
     "<b>-29%</b> (3.5€ &#8594; 2.5€)\n" +
     "Riski 4/4: <i>\"Heikommin menee\" 23.10.2020</i>\n";
    expect(renderMessage(enrichedAnalysis, priceQuote)).toEqual(expectedMessage);
  });

  test('should only render target price when last price is unknown', async () => {
    const priceQuote = {
      name: "Reka Industrial",
      isin: "FI0009800296",
      symbol: "ABC",
      tradecurrency: "EUR",
      marketplace: 3,
      time: "123",
      date: "123",
      insref: 1234
    }
    const expectedMessage = "<b>Vähennä <a href=\"https://www.inderes.fi/fi/yhtiot/reka-industrial\">Reka Industrial</a></b>\n" +
     "Tavoitehinta 2.5€\n" +
     "Riski 4/4: <i>\"Heikommin menee\" 23.10.2020</i>\n";

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(renderMessage(enrichedAnalysis, priceQuote)).toEqual(expectedMessage);
  });
});
