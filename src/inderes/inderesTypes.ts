
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

// Higher value indicates stronger buy signal. Value 3 is very rarely in use.
export enum Recommendation {
  Buy = '5',
  Accumulate = '4',
  Hold = '3',
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

export interface EnrichedAnalysis extends Analysis, CompanyReport {
}

export interface CompanyReport {
  label: string,
  published: string,
  url: string
}

export interface CompanyMapping {
  id: string,
  title: string,
  isin: string,
  tid: string,
  standby: boolean
}

export interface InderesPriceQuote {
  isin: string,
  marketplace: string,
  insref: string,
  symbol: string,
  name: string,
  tradecurrency: string,
  diff1d: string,
  diff1dprc: string,
  bidprice: string,
  askprice: string,
  lastprice: string,
  dayhighprice: string,
  daylowprice: string,
  closeprice1d: string,
  turnover: string,
  quantity: string,
  timestamp: string,
  no_last_price: boolean
}
