/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (TRY, USD, EUR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'TRY'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number as a percentage
 * @param value The value to format as percentage
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Alias for formatPercent for consistency with naming in components
 */
export const formatPercentage = formatPercent;
