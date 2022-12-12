import React from 'react';
import './styles.pcss';

export const Filter = ({
  filterByOnlyTitles,
  setFilterOnlyTitles,
}: {
  filterByOnlyTitles: boolean;
  setFilterOnlyTitles: SetQueryParam<boolean>;
}) => {
  return (
    <div className="filters">
      <span
        onClick={() => {
          setFilterOnlyTitles((prev) => !prev);
        }}
        className={`filter test-filter-only-title clickable ${
          filterByOnlyTitles ? 'selected' : ''
        }`}
      >
        {chrome.i18n.getMessage('filterBy_onlyTitles')}
      </span>
    </div>
  );
};
