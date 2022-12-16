import React from 'react';
import reactStringReplace from 'react-string-replace';
import { ICON_TYPE, MATCH_TAG, TABLE_TYPE } from '../constants';

const regexp = new RegExp(`<${MATCH_TAG}>(.+?)</${MATCH_TAG}>`, 'g');
const addHighlight = (str: string) =>
  reactStringReplace(str, regexp, (match, i) => (
    <span key={i} className="highlight">
      {match}
    </span>
  ));
const getType = (tableType: TableTypeWithoutWorkspace, record: RecordBase) =>
  'debug-' +
  (() => {
    switch (tableType) {
      case TABLE_TYPE.COLLECTION:
        return TABLE_TYPE.COLLECTION;
      case TABLE_TYPE.BLOCK:
        return `block-${(record as Block).type}`;
      default:
        throw new Error(`unknown tableType: ${tableType}`);
    }
  })().replaceAll('_', '-');

export default function Item({
  opensNewTab,
  tableType,
  icon,
  title,
  url,
  dirs,
  text,
  record,
}: {
  opensNewTab: boolean;
} & Item) {
  return (
    <div className={`item debug-record ${getType(tableType, record)}`}>
      <a
        className="url"
        {...(opensNewTab && { target: '_blank' })}
        href={url}
        onClick={() => console.log(record)}
      >
        <div className="page-icon-container">
          <div className="page-icon-wrapper">
            {icon.type === ICON_TYPE.EMOJI ? (
              <>{icon.value}</>
            ) : (
              <img
                className={[
                  'page-icon',
                  icon.value.match(/^https?:\/\/.+\.svg/) ? 'svg' : '',
                ].join(' ')}
                src={icon.value}
              />
            )}
          </div>
        </div>
        <div className="texts-container">
          <div className="texts">
            <p className="title">{addHighlight(title)}</p>
            {dirs.length > 0 && (
              <p className="dirs">
                {dirs
                  .map<React.ReactNode>((dir) => (
                    <span
                      key={dir.record.id}
                      className={getType(dir.tableType, record)}
                      onClick={(event) => {
                        console.log(dir.record);
                        event.stopPropagation();
                      }}
                    >
                      {dir.title}
                    </span>
                  ))
                  .reduce((prev, current) => [prev, ' / ', current])}
              </p>
            )}
            {text && <p className="text">{addHighlight(text)}</p>}
          </div>
        </div>
      </a>
    </div>
  );
}
