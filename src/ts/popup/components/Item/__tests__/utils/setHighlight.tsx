import React from 'react';
import { MATCH_TAG } from '../../../../constants';
import { setHighlight } from '../../utils';

it.each([
  {
    name: 'basic',
    input: {
      text: 'foo bar baz foobar',
      query: 'bar',
    },
    expected: [
      'foo ',
      <span key="1" className="highlight">
        bar
      </span>,
      ' baz foo',
      <span key="2" className="highlight">
        bar
      </span>,
    ],
  },
  {
    name: 'empty query',
    input: {
      text: 'foo bar baz',
      query: '',
    },
    expected: [<>foo bar baz</>],
  },
  {
    name: 'rm match tag',
    input: {
      text: `foo <${MATCH_TAG}>bar</${MATCH_TAG}> <${MATCH_TAG}>baz</${MATCH_TAG}>`,
      query: '',
    },
    expected: [<>foo bar baz</>],
  },
  // {
  //   name: 'multiple queries',
  //   input: {
  //     text: `foo <${MATCH_TAG}>bar</${MATCH_TAG}> <${MATCH_TAG}>baz</${MATCH_TAG}>`,
  //     query: '',
  //   },
  //   expected: [<>foo bar baz</>],
  // },
])('$name', ({ input, expected }) => {
  expect(setHighlight(input.text, input.query)).toEqual(expected);
});
