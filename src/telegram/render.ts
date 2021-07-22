import { EnrichedAnalysis, InderesPriceQuote, Recommendation } from "../inderes/inderesTypes";
import { guessLinkFromName } from "../inderes/utils";
import { SortableMessage } from "./telegramTypes";
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

// Calculates percentual difference between latest price and price estimate from analysis
export const calculatePotential = (latest: number, target: number): number => {
  return Math.round(100 * (target - latest) / latest);
}

// Prints percentual difference with explicit sign
export const renderPotential = (potential: number): string => {
  if (potential > 0) {
    return `+${potential}%`;
  }
  return `${potential}%`;
}

// Returns formatted message string for a given analysis. If latest market price is given, calculates potential
export const renderMessage = (a: EnrichedAnalysis, quote: InderesPriceQuote|null): SortableMessage => {
  let priceRow = "";
  let sortOrder = -1000;
  const targetprice_rounded = +Number(a.target_price).toFixed(1);
  if (quote?.lastprice && Number(quote.lastprice)) {
    const lastprice_rounded = +Number(quote.lastprice).toFixed(1);
    if (quote.tradecurrency == a.currency) {
      const potential = calculatePotential(Number(quote.lastprice), Number(a.target_price));
      sortOrder = potential;
      priceRow = `<b>${renderPotential(potential)}</b> (${lastprice_rounded}${renderCurrency(quote.tradecurrency)} &#8594; ${targetprice_rounded}${renderCurrency(a.currency)})\n`
    }
    else {
      console.log(`Currency mismatch: ${JSON.stringify(a)} ${JSON.stringify(quote)}`);
      priceRow = `${lastprice_rounded}${renderCurrency(quote.tradecurrency)} &#8594; ${targetprice_rounded}${renderCurrency(a.currency)}\n`
    }
  }
  else {
    priceRow = `Tavoitehinta ${targetprice_rounded}${renderCurrency(a.currency)}\n`
  }

  const message =
    `<b>${renderRecommendation(a.recommendation)} <a href="${guessLinkFromName(a.name)}">${a.name}</a></b>, riski ${a.risk_level}/4\n` +
    priceRow +
    `<i>"${a.label}"</i>` +
    `\n`;
  return {message: message, sortOrder: sortOrder};
}

// Compares sort orders of SortableMessages
export const comparePotentials = (a: SortableMessage, b: SortableMessage): number => {
  if (a.sortOrder > b.sortOrder) {
    return -1;
  }
  else if (a.sortOrder < b.sortOrder) {
    return 1;
  }
  return 0;
}
