import React from 'react';
import { FILTERS_BY } from '../../constants';

export const Filter = ({
  filtersBy,
  setFiltersBy,
}: {
  filtersBy: FiltersBy;
  setFiltersBy: (value: FiltersBy | ((prev: FiltersBy) => FiltersBy)) => void;
}) => {
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
        className={[
          'filter',
          'test-filter-only-title',
          'clickable',
          filtersBy[FILTERS_BY.ONLY_TITLE] ? 'selected' : '',
        ].join(' ')}
      >
        Only search titles
      </span>
    </div>
  );
};
