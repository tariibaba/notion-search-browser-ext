import React from 'react';
import reactStringReplace from 'react-string-replace';

const STRANGE_NOTION_TAG = 'gzkNfoUU';

const regexp = new RegExp(
  `<${STRANGE_NOTION_TAG}>(.+?)</${STRANGE_NOTION_TAG}>`,
  'g',
);
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
  return (
    <div className="item">
      <a className="url" {...(opensNewTab && { target: '_blank' })} href={url}>
        <div className="page-icon-container">
          {pageIcon || (
            <svg viewBox="0 0 30 30" className="icon-page">
              <g>
                <path d="M16,1H4v28h22V11L16,1z M16,3.828L23.172,11H16V3.828z M24,27H6V3h8v10h10V27z M8,17h14v-2H8V17z M8,21h14v-2H8V21z M8,25h14v-2H8V25z"></path>
              </g>
            </svg>
          )}
        </div>
        <div className="main-item">
          <p className="title">{addHighlight(title)}</p>
          {parentsPath && <p className="parents-path">{parentsPath}</p>}
          {text && <p className="text">{addHighlight(text)}</p>}
        </div>
      </a>
    </div>
  );
}
