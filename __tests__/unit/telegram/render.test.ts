import { guessLinkFromName } from '../../../src/telegram/render';

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
