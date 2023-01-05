import React from 'react';
import { MATCH_TAG } from '../../constants';
import { setHighlight } from '../Item/utils';

test.each([
  {
    name: 'basic',
    input: {
      text: 'foo bar baz foobar',
      query: 'bar',
    },
    expected: [
      'foo ',
      <em key="1">bar</em>,
      ' baz foo',
      <em key="3">bar</em>,
      '',
    ],
  },
  {
    name: 'empty query',
    input: {
      text: 'foo bar baz',
      query: '',
    },
    expected: [<span key="0">foo bar baz</span>],
  },
  {
    name: 'rm match tag',
    input: {
      text: `foo <${MATCH_TAG}>bar</${MATCH_TAG}> <${MATCH_TAG}>baz</${MATCH_TAG}>`,
      query: '',
    },
    expected: [<span key="0">foo bar baz</span>],
  },
  {
    name: 'multiple queries',
    input: {
      text: 'foo bar baz foobar',
      query: 'foo bar',
    },
    expected: [
      '',
      <em key="1">foo</em>,
      ' ',
      <em key="3">bar</em>,
      ' baz ',
      <em key="5">foo</em>,
      '',
      <em key="7">bar</em>,
      '',
    ],
  },
])('$name', ({ input, expected }) => {
  expect(setHighlight(input.text, input.query)).toEqual(expected);
});
