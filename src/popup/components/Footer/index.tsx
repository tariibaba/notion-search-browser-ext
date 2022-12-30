import React from 'react';
import { SEARCH_LIMIT } from '../../constants';
import './styles.pcss';

export const Footer = ({
  total,
  showsSummary,
  isPopup,
}: {
  total: number;
  showsSummary: boolean;
  isPopup: boolean;
}) => {
  const handleClickSetting = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    chrome.runtime.openOptionsPage();
    event.preventDefault();
  };
  const handleClickOpenInNewTab = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const url = new URL(location.href);
    url.searchParams.delete('popup');
    chrome.tabs.create({ url: url.toString() });
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
      <div className="icons">
        {/* TODO: i18n */}
        {isPopup && (
          <a
            href="#"
            title="Open in a new tab"
            onClick={handleClickOpenInNewTab}
          >
            <img src={chrome.runtime.getURL('./images/open-in-new-tab.png')} />
          </a>
        )}
        <a href="#" title="Open settings" onClick={handleClickSetting}>
          <img src={chrome.runtime.getURL('./images/settings.svg')} />
        </a>
      </div>
    </div>
  );
};
