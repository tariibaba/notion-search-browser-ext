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
              [FILTERS_BY.TITLE_ONLY]: !prev[FILTERS_BY.TITLE_ONLY],
            };
          });
        }}
        className={`filter ${
          filtersBy[FILTERS_BY.TITLE_ONLY] ? 'selected' : ''
        }`}
      >
        Only search title
      </span>
    </div>
  );
}
