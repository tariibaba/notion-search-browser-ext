import React from 'react';
import { SORT_BY } from '../constants';

export default function Sort({
  sortBy,
  setSortBy,
}: {
  sortBy: string;
  setSortBy: (value: string) => void;
}) {
  return (
    <div className="sorts">
      <select
        className="sort"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      >
        <option value={SORT_BY.RELEVANCE}>Best matches</option>
        <option value={SORT_BY.LAST_EDITED}>Last edited: Newest first</option>
        <option value={SORT_BY.CREATED}>Created: Newest first</option>
      </select>
    </div>
  );
}
