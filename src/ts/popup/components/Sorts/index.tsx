import React from 'react';
import { SORT_BY } from '../../constants';

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
        <option value={SORT_BY.RELEVANCE}>Best matches</option>
        <option value={SORT_BY.LAST_EDITED}>Last edited: Newest first</option>
        <option value={SORT_BY.CREATED}>Created: Newest first</option>
      </select>
    </div>
  );
};
