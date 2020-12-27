
export type Analyses = {
  [company_id: string]: Analysis
};

export interface Analysis {
  isin: string,
  name: string,
  date_of_recommendation: string,
  target_price: string,
  currency: string,
  recommendation: Recommendation,
  risk_level: Risk
}

// Higher value indicates stronger buy signal. Value 3 is not in use.
export enum Recommendation {
  Buy = '5',
  Accumulate = '4',
  Reduce = '2',
  Sell = '1'
}

// Higher value indicates higher risk.
export enum Risk {
  Highest = '4',
  Higher = '3',
  Lower = '2',
  Lowest = '1'
}
