import React from 'react';
import reactStringReplace from 'react-string-replace';
import { ICON_TYPE, MATCH_TAG } from '../constants';

const regexp = new RegExp(`<${MATCH_TAG}>(.+?)</${MATCH_TAG}>`, 'g');
const addHighlight = (str: string) =>
  reactStringReplace(str, regexp, (match, i) => (
    <span key={i} className="highlight">
      {match}
    </span>
  ));

export default function Item({
  opensNewTab,
  pageIcon,
  title,
  url,
  parentsPath,
  text,
}: {
  opensNewTab: boolean;
} & Item) {
  let icon: JSX.Element;
  switch (pageIcon?.type) {
    case undefined:
      icon = <img src={chrome.runtime.getURL('./images/page.svg')} />;
      break;
    case ICON_TYPE.EMOJI:
      icon = <>{pageIcon.value}</>;
      break;
    case ICON_TYPE.IMAGE:
      icon = (
        <>
          <img src={pageIcon.value} />
        </>
      );
      break;
    default:
      throw new Error(`unknown pageIcon.type: ${pageIcon?.type}`);
  }

  return (
    <div className="item">
      <a className="url" {...(opensNewTab && { target: '_blank' })} href={url}>
        <div className="page-icon-container">{icon}</div>
        <div className="main-item">
          <p className="title">{addHighlight(title)}</p>
          {parentsPath && <p className="parents-path">{parentsPath}</p>}
          {text && <p className="text">{addHighlight(text)}</p>}
        </div>
      </a>
    </div>
  );
}
