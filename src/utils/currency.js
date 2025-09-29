// Currency formatting utilities

export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  // Handle Indian currency formatting
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
  
  // Handle other currencies
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const detectCurrency = (restaurantCuisine) => {
  // Auto-detect currency based on cuisine type
  if (restaurantCuisine === 'Indian') {
    return 'INR';
  }
  return 'USD';
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // Simple conversion rates (in production, use real-time rates)
  const rates = {
    USD: 1,
    INR: 83.12,
    EUR: 0.85,
    GBP: 0.73
  };
  
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / rates[fromCurrency];
  return usdAmount * rates[toCurrency];
};