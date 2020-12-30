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
        expect(analysis).toHaveProperty('target_price');
        expect(analysis).toHaveProperty('currency');
        expect(analysis).toHaveProperty('recommendation');
        expect(analysis).toHaveProperty('risk_level');
    }
  });

});
