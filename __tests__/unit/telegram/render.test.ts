import { calculatePotential, guessLinkFromName } from '../../../src/telegram/render';

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
