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
        <option value="relevance">Best matches</option>
        <option value="lastEdited">Last edited: Newest first</option>
        <option value="created">Created: Newest first</option>
      </select>
    </div>
  );
}
