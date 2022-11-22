import React, { useEffect, useState } from 'react';
import { MIN_QUERY_LENGTH, SortBy, STORAGE_KEY } from '../constants';
import { debouncedSearch } from '../search';
import Filter from './Filters';
import Footer from './Footer';
import Items from './Items';
import SearchBox from './SearchBox';
import Sort from './Sorts';

export default function Container() {
  const isPopup = location.search === '?popup';
  const [renderable, setRenderable] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.RELEVANCE);
  const [filtersBy, setFiltersBy] = useState<FiltersBy>({});
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const savesLastSearchResult = isPopup;
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length >= MIN_QUERY_LENGTH;

  // set style & get cache
  useEffect(() => {
    if (isPopup) {
      // css ファイルを append した方が見通しは良くなるが、同期的なスタイル適用が出来ない
      document.body.style.width = '662px';
      document.body.style.margin = '0px';
    } else {
      document.body.style.margin = '40px 0 0 0';
    }
    (async () => {
      if (savesLastSearchResult) {
        const store: StorageData | undefined = (
          await chrome.storage.local.get(STORAGE_KEY)
        )[STORAGE_KEY];
        if (store) {
          setQuery(store.query);
          setSearchResult(store.searchResult);
        }
      }
      setRenderable(true);
    })();
  }, []);

  // search
  useEffect(() => {
    if (!hasQuery) return;

    (async () => {
      const result = await debouncedSearch({
        query: trimmedQuery,
        sortBy,
        filtersBy,
        savesLastSearchResult,
      });
      if (result) setSearchResult(result);
    })();
  }, [trimmedQuery, sortBy, filtersBy]); // TODO この filtersBy はいいの？

  return (
    <>
      {renderable && (
        <main {...(isPopup && { className: 'is-popup' })}>
          <SearchBox query={query} setQuery={setQuery} />
          <Filter filtersBy={filtersBy} setFiltersBy={setFiltersBy} />
          <Sort sortBy={sortBy} setSortBy={setSortBy} />
          {searchResult && hasQuery && (
            <>
              <Items items={searchResult.items} opensNewTab={isPopup} />
              <Footer total={searchResult.total} />
            </>
          )}
        </main>
      )}
    </>
  );
}
