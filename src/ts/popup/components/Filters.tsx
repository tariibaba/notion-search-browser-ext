import React from 'react';
import { FiltersBy } from '../constants';

export default function Filter({
  filtersBy,
  setFiltersBy,
}: {
  filtersBy: FiltersBy;
  setFiltersBy: (value: FiltersBy | ((prev: FiltersBy) => FiltersBy)) => void;
}) {
  return (
    <div className="filters">
      <span
        onClick={() => {
          setFiltersBy((prev) => {
            return {
              ...prev,
              [FiltersBy.TITLE_ONLY]: !prev[FiltersBy.TITLE_ONLY],
            };
          });
        }}
        className={`filter ${
          filtersBy[FiltersBy.TITLE_ONLY] ? 'selected' : ''
        }`}
      >
        Only search title
      </span>
    </div>
  );
}
