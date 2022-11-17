import React from 'react';

export default function Sort({
  sortBy,
  setSortBy,
}: {
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
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
