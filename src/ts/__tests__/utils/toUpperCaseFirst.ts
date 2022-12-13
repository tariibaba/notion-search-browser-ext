import { toUpperCaseFirst } from '../../utils';

it.each([
  { name: 'empty', input: '', expects: '' },
  { name: 'one', input: 'a', expects: 'A' },
  { name: 'already upper case', input: 'A', expects: 'A' },
  { name: 'length >= 2', input: 'hello.', expects: 'Hello.' },
  { name: 'symbol', input: '[', expects: '[' },
])('$name', ({ input, expects }) => {
  expect(toUpperCaseFirst(input)).toBe(expects);
});
