import { formatCurrency, getMonthName, getCurrentDateFormatted } from '../dashboardUtils';

describe('dashboardUtils', () => {
  test('formatCurrency should format number as BRL', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });

  test('getMonthName should return correct month name', () => {
    expect(getMonthName(0)).toBe('Janeiro');
    expect(getMonthName(11)).toBe('Dezembro');
  });

  test('getCurrentDateFormatted should return a string', () => {
    expect(typeof getCurrentDateFormatted()).toBe('string');
  });
});
