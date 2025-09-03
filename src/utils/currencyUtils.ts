export const formatCurrencyWithSymbol = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatCurrencyWithoutSymbol = (value: number): string =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).replace('R$\xa0', '');

export const formatUserCurrencyInput = (inputValue: string): string => {
  const digitsOnly = inputValue.replace(/\D/g, '');
  const intValue = parseInt(digitsOnly, 10);
  if (isNaN(intValue)) return '';
  return formatCurrencyWithoutSymbol(intValue / 100);
};

export const parseCurrencyStringToNumber = (formattedValue: string): number =>
  Number(formattedValue.replace(/\./g, '').replace(/,/g, '.'));

export const createCurrencyInputHandler = (setAmount: (value: string) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => setAmount(formatUserCurrencyInput(e.target.value));
