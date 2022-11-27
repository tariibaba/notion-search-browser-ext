import { answerToIndex } from '../../activation';

it.each([
  ['1', 1],
  ['01', 1],
  ['0', 0],
  ['', NaN],
  ['x', NaN],
  ['１', 1],
  ['　１09  ', 109],
])('%s -> %j', (input, expects) => {
  expect(answerToIndex(input)).toBe(expects);
});
