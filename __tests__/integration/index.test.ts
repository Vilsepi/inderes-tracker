import { InderesClient } from '../../src/inderes/inderes';

describe('Inderes.fi', () => {
  const client = new InderesClient();

  test('should return array of company analyses', async () => {
    const analyses = await client.getAnalyses();
    expect(analyses.length).toBeGreaterThanOrEqual(100);
    for (const analysis of analyses) {
        expect(analysis).toHaveProperty('isin');
        expect(analysis).toHaveProperty('name');
        expect(analysis).toHaveProperty('date_of_recommendation');
        if (analysis.name != 'Arvo Sijoitusosuuskunta') {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(analysis).toHaveProperty('target_price');
          // eslint-disable-next-line jest/no-conditional-expect
          expect(analysis).toHaveProperty('currency');
          // eslint-disable-next-line jest/no-conditional-expect
          expect(analysis).toHaveProperty('recommendation');
          // eslint-disable-next-line jest/no-conditional-expect
          expect(analysis).toHaveProperty('risk_level');
        }
    }
  });

  test('should return last price for given company', async () => {
    const quote = await client.getPriceFromWebpage('gofore');
    expect(quote).toHaveProperty('lastprice');
    expect(Number(quote.lastprice)).toBeGreaterThanOrEqual(1);
    expect(quote).toHaveProperty('tradecurrency');
  });

});
