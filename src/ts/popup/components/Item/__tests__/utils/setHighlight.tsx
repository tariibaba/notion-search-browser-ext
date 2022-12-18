import React from 'react';
import { MATCH_TAG } from '../../../../constants';
import { setHighlight } from '../../../Item/utils';

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
      <span key="3" className="highlight">
        bar
      </span>,
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
      <span key="1" className="highlight">
        foo
      </span>,
      ' ',
      <span key="3" className="highlight">
        bar
      </span>,
      ' baz ',
      <span key="5" className="highlight">
        foo
      </span>,
      '',
      <span key="7" className="highlight">
        bar
      </span>,
      '',
    ],
  },
])('$name', ({ input, expected }) => {
  expect(setHighlight(input.text, input.query)).toEqual(expected);
});
