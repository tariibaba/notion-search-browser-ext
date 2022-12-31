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
      {showsSummary && (
        <div
          className="summary"
          dangerouslySetInnerHTML={{
            __html:
              total > SEARCH_LIMIT
                ? chrome.i18n.getMessage('summaryOfResultOverLimit', [
                    total.toLocaleString(),
                    SEARCH_LIMIT.toLocaleString(),
                  ])
                : chrome.i18n.getMessage(
                    'summaryOfResult',
                    total.toLocaleString(),
                  ),
          }}
        ></div>
      )}
      <div className="icons">
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
