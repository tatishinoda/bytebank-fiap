import { getMonthName, getCurrentDateFormatted } from '../utils';

describe('utils', () => {
  test('getMonthName should return correct month name', () => {
    expect(getMonthName(0)).toBe('Janeiro');
    expect(getMonthName(11)).toBe('Dezembro');
  });

  test('getCurrentDateFormatted should return a string', () => {
    expect(typeof getCurrentDateFormatted()).toBe('string');
  });
});
