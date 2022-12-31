import escapeRegExp from 'lodash.escaperegexp';
import React from 'react';
import reactStringReplace from 'react-string-replace';
import { MATCH_TAG } from '../../constants';

const REGEXP_REMOVES_TAG = new RegExp(`</?${MATCH_TAG}>`, 'g');

export const setHighlight = (text: string, query: string) => {
  const replacedText = text.replace(REGEXP_REMOVES_TAG, '');

  const trimmedQuery = query.trim();
  if (trimmedQuery === '') return [<span key={0}>{replacedText}</span>];

  return reactStringReplace(
    replacedText,
    new RegExp(
      `(${trimmedQuery
        .split(/\s+/)
        .map((query) => escapeRegExp(query))
        .join('|')})`,
      'ig',
    ),
    (match, i) => <em key={i}>{match}</em>,
  );
};
