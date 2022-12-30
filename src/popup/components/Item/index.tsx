import React from 'react';
import { ICON_TYPE } from '../../constants';
import './styles.pcss';
import { setHighlight } from './utils';

const getType = (block: Block) =>
  'debug-block-' + block.type.replaceAll('_', '-');

export default function Item({
  isPopup,
  query,
  icon,
  title,
  url,
  dirs,
  text,
  block,
}: {
  isPopup: boolean;
  query: string;
} & Item) {
  return (
    <div
      className={`item test-item-${block.id} debug-record ${getType(block)}`}
    >
      <a
        className="url"
        {...(isPopup && { target: '_blank' })}
        href={url}
        onClick={() => console.info(block)}
      >
        <div className="page-icon-container">
          <div className="page-icon-wrapper">
            {icon.type === ICON_TYPE.EMOJI ? (
              <>{icon.value}</>
            ) : (
              <img
                className={`page-icon ${
                  icon.value.match(/^https?:\/\/.+\.svg/) ? 'svg' : ''
                }`}
                src={icon.value}
              />
            )}
          </div>
        </div>
        <div className="texts-container">
          <div className="texts">
            <p className={`title ${query.trim().length > 0 ? '' : 'no-query'}`}>
              {setHighlight(title, query)}
            </p>
            {dirs.length > 0 && (
              <p className="dirs">
                {dirs
                  .map<React.ReactNode>((dir) => (
                    <span
                      key={dir.block.id}
                      className={getType(block)}
                      onClick={(event) => {
                        console.info(dir.block);
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
