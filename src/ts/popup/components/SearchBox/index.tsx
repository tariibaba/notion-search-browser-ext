import React, { useEffect, useRef } from 'react';

const INPUT_CLASS_NAME = 'query';

export const SearchBox = ({
  query,
  setQuery,
  workspaceName,
}: {
  query: string;
  setQuery: (value: string) => void;
  workspaceName: string;
}) => {
  // input の value に state を指定すると onhashchange 時に変化が取り消されてしまう
  // ため、回避策 (use-hash-param の問題)
  // TODO: useURLParams に乗り換えたら state にする
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = query;
  }, [query]);

  return (
    <div className="search-box">
      <img
        className="icon-search"
        src={chrome.runtime.getURL('./images/search.svg')}
      ></img>
      <input
        ref={inputRef}
        type="search"
        className={INPUT_CLASS_NAME}
        placeholder={`Search ${workspaceName}...`}
        autoFocus
        onChange={(event) => setQuery(event.target.value)}
      />
    </div>
  );
};
