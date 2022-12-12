import React from 'react';
import { SORT_BY } from '../../constants';
import './styles.pcss';

export const Sort = ({
  sortBy,
  setSortBy,
}: {
  sortBy: string;
  setSortBy: SetQueryParam<string>;
}) => {
  return (
    <div className="sorts-container">
      <select
        className="sorts clickable"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      >
        <option value={SORT_BY.RELEVANCE}>
          {chrome.i18n.getMessage('sortBy_relevance')}
        </option>
        <option value={SORT_BY.LAST_EDITED}>
          {chrome.i18n.getMessage('sortBy_lastEdited') +
            ' ' +
            chrome.i18n.getMessage('sortBy_newestFirst')}
        </option>
        <option value={SORT_BY.CREATED}>
          {chrome.i18n.getMessage('sortBy_created') +
            ' ' +
            chrome.i18n.getMessage('sortBy_newestFirst')}
        </option>
      </select>
    </div>
  );
};
