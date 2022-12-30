import React from 'react';
import './styles.pcss';

export const Filter = ({
  filterOnlyTitles,
  setFilterOnlyTitles,
}: {
  filterOnlyTitles: boolean;
  setFilterOnlyTitles: SetQueryParam<boolean>;
}) => {
  return (
    <div className="filters">
      <span
        onClick={() => {
          setFilterOnlyTitles((prev) => !prev);
        }}
        className={`filter test-filter-only-title clickable ${
          filterOnlyTitles ? 'selected' : ''
        }`}
      >
        Only search titles
      </span>
    </div>
  );
};
