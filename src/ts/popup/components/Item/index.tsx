import React from 'react';
import { ICON_TYPE } from '../../constants';
import { setHighlight } from './utils';

export default function Item({
  opensNewTab,
  query,
  pageIcon,
  title,
  url,
  parentsPath,
  text,
}: {
  opensNewTab: boolean;
  query: string;
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
      icon = <img src={pageIcon.value} />;
      break;
    default:
      throw new Error(`unknown pageIcon.type: ${pageIcon?.type}`);
  }

  return (
    <div className="item">
      <a className="url" {...(opensNewTab && { target: '_blank' })} href={url}>
        <div className="page-icon-container">{icon}</div>
        <div className="main-item">
          <p className="title">{setHighlight(title, query)}</p>
          {parentsPath && <p className="parents-path">{parentsPath}</p>}
          {text && <p className="text">{setHighlight(text, query)}</p>}
        </div>
      </a>
    </div>
  );
}
