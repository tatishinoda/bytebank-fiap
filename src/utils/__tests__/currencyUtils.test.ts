import { formatCurrencyValue, formatCurrencyInput, parseCurrencyValue } from '../currencyUtils';

describe('currencyUtils', () => {
  test('formatCurrencyValue should format number to BRL string', () => {
    expect(formatCurrencyValue(1234.56)).toBe('1.234,56');
    expect(formatCurrencyValue(0)).toBe('0,00');
  });

  test('formatCurrencyInput should format input string to BRL string', () => {
    expect(formatCurrencyInput('123456')).toBe('1.234,56');
    expect(formatCurrencyInput('')).toBe('');
    expect(formatCurrencyInput('abc')).toBe('');
    expect(formatCurrencyInput('100')).toBe('1,00');
  });

  test('parseCurrencyValue should parse BRL string to number', () => {
    expect(parseCurrencyValue('1.234,56')).toBe(1234.56);
    expect(parseCurrencyValue('0,00')).toBe(0);
    expect(parseCurrencyValue('')).toBe(0);
  });
});
