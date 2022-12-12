import React from 'react';
import { FILTERS_BY } from '../constants';

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
              [FILTERS_BY.ONLY_TITLE]: !prev[FILTERS_BY.ONLY_TITLE],
            };
          });
        }}
        className={`filter ${
          filtersBy[FILTERS_BY.ONLY_TITLE] ? 'selected' : ''
        }`}
      >
        Only search title
      </span>
    </div>
  );
}
