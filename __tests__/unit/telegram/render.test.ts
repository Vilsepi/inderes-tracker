import { Recommendation, Risk } from '../../../src/inderes/inderesTypes';
import { calculatePotential, renderMessage } from '../../../src/telegram/render';

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
      lastprice: '3.5',
      tradecurrency: 'EUR'
    }
    const expectedMessage = "<b>Vähennä <a href=\"https://www.inderes.fi/fi/yhtiot/reka-industrial\">Reka Industrial</a></b>, riski 4/4\n" +
     "<b>-29%</b> (3.5€ &#8594; 2.5€)\n" +
     "<i>\"Heikommin menee\"</i>\n";
    expect(renderMessage(enrichedAnalysis, priceQuote)).toEqual(expectedMessage);
  });

  test('should not calculate potential if currencies mismatch', async () => {
    const priceQuote = {
      lastprice: '35',
      tradecurrency: 'SEK'
    }
    const expectedMessage = "<b>Vähennä <a href=\"https://www.inderes.fi/fi/yhtiot/reka-industrial\">Reka Industrial</a></b>, riski 4/4\n" +
     "35SEK &#8594; 2.5€\n" +
     "<i>\"Heikommin menee\"</i>\n";
    expect(renderMessage(enrichedAnalysis, priceQuote)).toEqual(expectedMessage);
  });

  test('should only render target price when last price is unknown', async () => {
    const priceQuote = {
      name: "Reka Industrial",
      isin: "FI0009800296"
    }
    const expectedMessage = "<b>Vähennä <a href=\"https://www.inderes.fi/fi/yhtiot/reka-industrial\">Reka Industrial</a></b>, riski 4/4\n" +
     "Tavoitehinta 2.5€\n" +
     "<i>\"Heikommin menee\"</i>\n";

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(renderMessage(enrichedAnalysis, priceQuote)).toEqual(expectedMessage);
  });
});
