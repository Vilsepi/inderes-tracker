import { EnrichedAnalysis, Recommendation } from "../inderes/inderesTypes";
import { PriceQuote } from "../millistream/millistreamTypes";

// Returns localized text for buy/sell recommendation
export const renderRecommendation = (recommendation: Recommendation): string => {
  if (recommendation == Recommendation.Buy) {
    return "Osta";
  }
  else if (recommendation == Recommendation.Accumulate) {
    return "Lisää";
  }
  else if (recommendation == Recommendation.Reduce) {
    return "Vähennä";
  }
  else if (recommendation == Recommendation.Sell) {
    return "Myy";
  }
  else {
    return "???";
  }
}

// Convert three-letter currency identifiers to known symbols
export const renderCurrency = (currency: string): string => {
  if (currency == 'EUR') {
    return '€';
  }
  else if (currency == 'USD') {
    return '$';
  }
  else {
    return currency;
  }
}

// Guess company page URL from the company name as it is not provided by the API
export const guessLinkFromName = (name: string): string => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/ - /g,'-')
    .replace(/ /g,'-')
    .replace(/å/g,'a')
    .replace(/ä/g,'a')
    .replace(/ö/g,'o')
    .replace(/[^\w-]+/g,'')
  return `https://www.inderes.fi/fi/yhtiot/${slug}`;
}

// Prints percentual difference between latest price and price estimate from analysis
const calculatePotential = (latest: number, target: number): string => {
  const potential = Math.round((1 - (latest/target)) * 100);
  if (potential > 0) {
    return `+${potential}%`;
  }
  return `${potential}%`;
}

// Returns formatted message string for a given analysis
export const renderMessage = (a: EnrichedAnalysis, quote: PriceQuote): string => {
  const potential = calculatePotential(quote.lastprice, Number(a.target_price));
  const message =
    `<b>${renderRecommendation(a.recommendation)} <a href="${guessLinkFromName(a.name)}">${a.name}</a></b>\n` +
    `<b>${potential}</b> (${quote.lastprice}${renderCurrency(a.currency)} &#8594; ${a.target_price}${renderCurrency(a.currency)})\n` +
    `Riski ${a.risk_level}/4: ` +
    `<i>"${a.label}" ${a.date_of_recommendation}</i>` +
    `\n`;
  return message;
}
