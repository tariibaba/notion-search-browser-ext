import React, { useEffect } from 'react';
import './styles.pcss';

const INPUT_CLASS_NAME = 'query';

export const SearchBox = ({
  query,
  setQuery,
  workspaceName,
}: {
  query: string;
  setQuery: SetQueryParam<string>;
  workspaceName: string;
}) => {
  // input の value に state を指定すると onhashchange 時に変化が取り消されてしまう
  useEffect(() => {
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode(
        `.${INPUT_CLASS_NAME}::-webkit-search-cancel-button {
          background-image: url("${chrome.runtime.getURL(
            './images/clear-query.svg',
          )}");
        }`,
      ),
    );
    document.body.appendChild(style);
  }, []);

  return (
    <div className="search-box">
      <img
        className="icon-search"
        src={chrome.runtime.getURL('./images/search.svg')}
      ></img>
      <input
        type="search"
        className={INPUT_CLASS_NAME}
        placeholder={`Search ${workspaceName}...`}
        autoFocus
        onChange={(event) => setQuery(event.target.value)}
        value={query}
      />
    </div>
  );
};
