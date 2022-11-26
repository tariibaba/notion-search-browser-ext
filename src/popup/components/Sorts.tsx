import React from 'react';

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
        <option value="RELEVANCE">Best matches</option>
        <option value="LAST_EDITED">Last edited: Newest first</option>
        <option value="CREATED">Created: Newest first</option>
      </select>
    </div>
  );
}
