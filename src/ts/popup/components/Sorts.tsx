import React from 'react';
import { SortBy } from '../constants';

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
        <option value={SortBy.RELEVANCE}>Best matches</option>
        <option value={SortBy.LAST_EDITED}>Last edited: Newest first</option>
        <option value={SortBy.CREATED}>Created: Newest first</option>
      </select>
    </div>
  );
}
