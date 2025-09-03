// Utilitários para formatação e parsing de moeda brasileira

export const formatCurrencyValue = (value: number): string =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).replace('R$\xa0', '');

export const formatCurrencyInput = (inputValue: string): string => {
  const digitsOnly = inputValue.replace(/\D/g, '');
  const intValue = parseInt(digitsOnly, 10);
  if (isNaN(intValue)) return '';
  return formatCurrencyValue(intValue / 100);
};

export const parseCurrencyValue = (formattedValue: string): number =>
  Number(formattedValue.replace(/\./g, '').replace(/,/g, '.'));

export const createCurrencyInputHandler = (setAmount: (value: string) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => setAmount(formatCurrencyInput(e.target.value));
