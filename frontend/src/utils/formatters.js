/**
 * Formats a number to Indian Rupee (₹) currency format.
 */
export const formatCurrency = (amount) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // usually integers look cleaner on dashboards unless cents are explicitly needed
  }).format(numericAmount);
};

/**
 * Formats a date string to a human-readable medium format (e.g. Jun 8, 2026, 8:29 PM).
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
