import React from 'react';
import { FilterBy } from '../constants';

export default function Filter({
  filterBy,
  setFilterBy,
}: {
  filterBy: FilterBy;
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>;
}) {
  return (
    <div className="filters">
      <span
        onClick={() =>
          setFilterBy(
            filterBy === FilterBy.TITLE_ONLY ? null : FilterBy.TITLE_ONLY,
          )
        }
        className={`filter only-search-title ${
          filterBy === FilterBy.TITLE_ONLY ? 'selected' : ''
        }`}
      >
        Only search title
      </span>
    </div>
  );
}
