/**
 * Utility functions for Brazilian currency formatting and parsing
 */

/**
 * Formats a number value to Brazilian currency format (without symbol)
 * @param value - The numeric value to format
 * @returns Formatted string (e.g., "1.234,56")
 */
export const formatCurrencyValue = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).replace('R$\xa0', '');
};

/**
 * Handles input change for Brazilian currency formatting
 * @param inputValue - The raw input string
 * @returns Formatted string ready for display
 */
export const formatCurrencyInput = (inputValue: string): string => {
  // Remove tudo que não é dígito
  const digitsOnly = inputValue.replace(/\D/g, '');

  // Formata para centavos
  const intValue = parseInt(digitsOnly, 10);

  if (isNaN(intValue)) {
    return '';
  }

  // Divide por 100 para obter reais e centavos
  return formatCurrencyValue(intValue / 100);
};

/**
 * Parses a Brazilian formatted currency string to number
 * @param formattedValue - Brazilian formatted string (e.g., "1.234,56")
 * @returns Numeric value (e.g., 1234.56)
 */
export const parseCurrencyValue = (formattedValue: string): number => {
  // Aceita vírgula como separador decimal e remove pontos de milhar
  const normalizedValue = formattedValue.replace(/\./g, '').replace(/,/g, '.');
  return Number(normalizedValue);
};

/**
 * Creates a currency input change handler
 * @param setAmount - State setter function for the amount
 * @returns Event handler function
 */
export const createCurrencyInputHandler = (
  setAmount: (value: string) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setAmount(formatted);
  };
};
