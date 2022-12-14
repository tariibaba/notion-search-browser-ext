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
  icon,
  title,
  url,
  dirs,
  text,
}: {
  opensNewTab: boolean;
} & Item) {
  return (
    <div className="item">
      <a className="url" {...(opensNewTab && { target: '_blank' })} href={url}>
        <div className="page-icon-container">
          {icon.type === ICON_TYPE.EMOJI ? (
            <>{icon.value}</>
          ) : (
            <img src={icon.value} />
          )}
        </div>
        <div className="main-item">
          <p className="title">{addHighlight(title)}</p>
          {dirs && <p className="dirs">{dirs}</p>}
          {text && <p className="text">{addHighlight(text)}</p>}
        </div>
      </a>
    </div>
  );
}
