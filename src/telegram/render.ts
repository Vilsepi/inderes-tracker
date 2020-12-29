import { EnrichedAnalysis, Recommendation } from "../inderes/inderesTypes";

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

export const renderMessage = (a: EnrichedAnalysis): string => {
  const message =
    `<b>${renderRecommendation(a.recommendation)} <a href="https://inderes.fi">${a.name}</a></b>\n` +
    `Tavoitehinta ${a.target_price} ${renderCurrency(a.currency)}\n` +
    `Riski ${a.risk_level}/4: ` +
    `<i>"${a.label}" ${a.date_of_recommendation}</i>` +
    `\n`;
  return message;
}
