import React from 'react';
import { FiltersBy } from '../constants';

export default function Filter({
  filtersBy,
  setFiltersBy,
}: {
  filtersBy: FiltersBy;
  setFiltersBy: (value: FiltersBy) => void;
}) {
  return (
    <div className="filters">
      <span
        onClick={() => {
          // TODO: 余裕あったら prev を参照する形に変える（use-hash-paramの型の変更が必要）
          setFiltersBy({
            ...filtersBy,
            [FiltersBy.TITLE_ONLY]: !filtersBy[FiltersBy.TITLE_ONLY],
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
