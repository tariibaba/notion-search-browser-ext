import React from 'react';
import { SEARCH_LIMIT } from '../../constants';

export const Footer = ({
  total,
  showsSummary,
}: {
  total: number;
  showsSummary: boolean;
}) => {
  const handleClickSettings = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    chrome.runtime.openOptionsPage();
    event.preventDefault();
  };
  return (
    <div className="footer">
      <div className="summary">
        {showsSummary && (
          <>
            {total > SEARCH_LIMIT && (
              <>
                <span className="total">{SEARCH_LIMIT}</span> of{' '}
              </>
            )}
            <span className="total">{total}</span> results
          </>
        )}
      </div>
      <div className="settings">
        <a href="#" onClick={handleClickSettings}>
          <img
            className="icon-settings"
            src={chrome.runtime.getURL('./images/settings.svg')}
          />
        </a>
      </div>
    </div>
  );
};
