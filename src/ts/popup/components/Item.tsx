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
      icon = (
        <svg viewBox="0 0 30 30">
          <g>
            <path d="M16,1H4v28h22V11L16,1z M16,3.828L23.172,11H16V3.828z M24,27H6V3h8v10h10V27z M8,17h14v-2H8V17z M8,21h14v-2H8V21z M8,25h14v-2H8V25z"></path>
          </g>
        </svg>
      );
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
