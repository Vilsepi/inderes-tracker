import { MillistreamClient } from '../../src/millistream/millistream';

describe('Millistream.com', () => {
  const client = new MillistreamClient();

  test('should return expected price quote for Orion', async () => {
    const quote = await client.getQuoteByISIN('FI0009014377');
    expect(quote.name).toEqual('Orion B');
    expect(quote.marketplace).toEqual(35235);
    expect(quote.insref).toEqual(4322);
    expect(quote.lastprice).toBeGreaterThan(0);
  });

  test('should return expected price quote for Remedy', async () => {
    const quote = await client.getQuoteByISIN('FI4000251897');
    expect(quote.name).toEqual('Remedy Entertainment');
    expect(quote.marketplace).toEqual(35182);
    expect(quote.insref).toEqual(3100156);
    expect(quote.lastprice).toBeGreaterThan(0);
  });
});
