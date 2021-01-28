import { EnrichedAnalysis, InderesPriceQuote, Recommendation } from "../inderes/inderesTypes";
import { guessLinkFromName } from "../inderes/utils";
// import { PriceQuote } from "../millistream/millistreamTypes";

// Returns localized text for buy/sell recommendation
export const renderRecommendation = (recommendation: Recommendation): string => {
  if (recommendation == Recommendation.Buy) {
    return "Osta";
  }
  else if (recommendation == Recommendation.Accumulate) {
    return "Lisää";
  }
  else if (recommendation == Recommendation.Hold) {
    return "Pidä";
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

// Prints percentual difference between latest price and price estimate from analysis
export const calculatePotential = (latest: number, target: number): string => {
  const potential = Math.round(100 * (target - latest) / latest);
  if (potential > 0) {
    return `+${potential}%`;
  }
  return `${potential}%`;
}

// Returns formatted message string for a given analysis
export const renderMessage = (a: EnrichedAnalysis, quote: InderesPriceQuote): string => {
  let priceRow = "";
  const lastprice = Number(quote.lastprice);
  if (lastprice) {
    const potential = calculatePotential(lastprice, Number(a.target_price));
    priceRow = `<b>${potential}</b> (${lastprice}${renderCurrency(a.currency)} &#8594; ${a.target_price}${renderCurrency(a.currency)})\n`
  }
  else {
    priceRow = `Tavoitehinta ${a.target_price}${renderCurrency(a.currency)}\n`
  }

  const message =
    `<b>${renderRecommendation(a.recommendation)} <a href="${guessLinkFromName(a.name)}">${a.name}</a></b>\n` +
    priceRow +
    `Riski ${a.risk_level}/4: ` +
    `<i>"${a.label}" ${a.date_of_recommendation}</i>` +
    `\n`;
  return message;
}
