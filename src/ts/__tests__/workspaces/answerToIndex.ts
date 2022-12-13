import { answerToIndex } from '../../workspaces';

it.each([
  { input: '1', expected: 1 },
  { input: '01', expected: 1 },
  { input: '0', expected: 0 },
  { input: '', expected: NaN },
  { input: 'x', expected: NaN },
  { input: '１', expected: 1 },
  { input: '　１09  ', expected: 109 },
])("'$input' -> $expected", ({ input, expected }) => {
  expect(answerToIndex(input)).toBe(expected);
});
