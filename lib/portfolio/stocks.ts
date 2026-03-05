export const NSE_STOCKS = [
  // IT & Software
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'INFY.NS', name: 'Infosys', sector: 'IT' },
  { symbol: 'WIPRO.NS', name: 'Wipro', sector: 'IT' },
  { symbol: 'HCL.NS', name: 'HCL Technologies', sector: 'IT' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'IT' },
  { symbol: 'LTIM.NS', name: 'LTIMindtree', sector: 'IT' },
  
  // Banking & Finance
  { symbol: 'HDFC.NS', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking' },
  
  // Energy & Utilities
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corporation', sector: 'Utilities' },
  { symbol: 'NTPC.NS', name: 'NTPC Limited', sector: 'Utilities' },
  
  // Pharma & Healthcare
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical', sector: 'Pharma' },
  { symbol: 'CIPLA.NS', name: 'Cipla', sector: 'Pharma' },
  { symbol: 'DRREDDY.NS', name: 'Dr. Reddy\'s Laboratories', sector: 'Pharma' },
  { symbol: 'LUPIN.NS', name: 'Lupin', sector: 'Pharma' },
  
  // Automobiles
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', sector: 'Auto' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Auto' },
  { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', sector: 'Auto' },
  
  // Consumer & Retail
  { symbol: 'ITC.NS', name: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India', sector: 'FMCG' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'MARICO.NS', name: 'Marico', sector: 'FMCG' },
  
  // Cement & Construction
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', sector: 'Cement' },
  { symbol: 'SHREECEM.NS', name: 'Shree Cement', sector: 'Cement' },
  { symbol: 'AMBUJACEMENT.NS', name: 'Ambuja Cements', sector: 'Cement' },
  
  // Metals & Mining
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Steel' },
  { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', sector: 'Metals' },
  
  // Real Estate & Infrastructure
  { symbol: 'DLF.NS', name: 'DLF Limited', sector: 'Realty' },
  { symbol: 'INDIGO.NS', name: 'IndiGo', sector: 'Aviation' },
];

export function getStocksBySector(): Record<string, typeof NSE_STOCKS> {
  const bySector: Record<string, typeof NSE_STOCKS> = {};
  
  for (const stock of NSE_STOCKS) {
    if (!bySector[stock.sector]) {
      bySector[stock.sector] = [];
    }
    bySector[stock.sector].push(stock);
  }
  
  return bySector;
}

export const PRESET_PORTFOLIOS = [
  {
    name: 'Balanced Tech & Finance',
    stocks: ['TCS.NS', 'INFY.NS', 'HDFC.NS', 'ICICIBANK.NS', 'RELIANCE.NS'],
  },
  {
    name: 'Defensive FMCG & Pharma',
    stocks: ['ITC.NS', 'HINDUNILVR.NS', 'SUNPHARMA.NS', 'CIPLA.NS', 'NESTLEIND.NS'],
  },
  {
    name: 'Growth IT & Auto',
    stocks: ['TCS.NS', 'INFY.NS', 'MARUTI.NS', 'TECHM.NS', 'HCL.NS'],
  },
  {
    name: 'Diversified Nifty 50 Sample',
    stocks: ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFC.NS', 'ICICIBANK.NS', 'SBIN.NS', 'ITC.NS', 'LT.NS'],
  },
];
