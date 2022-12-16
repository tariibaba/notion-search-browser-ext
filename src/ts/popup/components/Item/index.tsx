import React from 'react';
import { ICON_TYPE, TABLE_TYPE } from '../../constants';
import { setHighlight } from './utils';

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
  query,
  tableType,
  icon,
  title,
  url,
  dirs,
  text,
  record,
}: {
  opensNewTab: boolean;
  query: string;
} & Item) {
  return (
    <div className={`item debug-record ${getType(tableType, record)}`}>
      <a
        className="url"
        {...(opensNewTab && { target: '_blank' })}
        href={url}
        onClick={() => console.info(record)}
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
            <p
              className={[
                'title',
                query.trim().length > 0 ? '' : 'no-query',
              ].join(' ')}
            >
              {setHighlight(title, query)}
            </p>
            {dirs.length > 0 && (
              <p className="dirs">
                {dirs
                  .map<React.ReactNode>((dir) => (
                    <span
                      key={dir.record.id}
                      className={getType(dir.tableType, record)}
                      onClick={(event) => {
                        console.info(dir.record);
                        event.stopPropagation();
                      }}
                    >
                      {dir.title}
                    </span>
                  ))
                  .reduce((prev, current) => [prev, ' / ', current])}
              </p>
            )}
            {text !== undefined && (
              <p className="text">{setHighlight(text, query)}</p>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}
