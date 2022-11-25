import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHashParam, useObjectHashParam } from 'use-hash-param';
import { SortBy, STORAGE_KEY } from '../constants';
import { debouncedSearch } from '../search';
import Filter from './Filters';
import Footer from './Footer';
import Items from './Items';
import SearchBox from './SearchBox';
import Sort from './Sorts';

export default function Container() {
  const isPopup = location.search === '?popup';

  const [query, setQuery] = useHashParam('query', '');
  const SortStateAndSetter = useHashParam('sort_by', SortBy.RELEVANCE);
  let [sortBy] = SortStateAndSetter;
  const [, setSortBy] = SortStateAndSetter;
  const [filtersBy, setFiltersBy] = useObjectHashParam<FiltersBy>(
    'filters_by',
    {},
  );

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const savesLastSearchResult = isPopup;
  const trimmedQuery = query.trim();

  // initialize
  useLayoutEffect(() => {
    // set style
    if (isPopup) {
      // css ファイルを append した方が見通しは良くなるが、同期的なスタイル適用が出来ない
      document.body.style.width = '662px';
      document.body.style.margin = '0px';
    } else {
      document.body.style.margin = '40px 0 0 0';
    }
    // get cache
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
    })();
  }, []);

  // search
  useEffect(() => {
    (async () => {
      // ad hoc: query == '' && sort == 'relevance' is worthless
      if (trimmedQuery === '' && sortBy === SortBy.RELEVANCE)
        sortBy = SortBy.CREATED;

      let result: SearchResult;
      try {
        result = await debouncedSearch({
          query: trimmedQuery,
          sortBy,
          filtersBy,
          savesLastSearchResult,
        });
        setSearchResult(result);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    })();
  }, [trimmedQuery, sortBy, filtersBy]);

  return (
    <main {...(isPopup && { className: 'is-popup' })}>
      <SearchBox query={query} setQuery={setQuery} />
      <Filter filtersBy={filtersBy} setFiltersBy={setFiltersBy} />
      <Sort sortBy={sortBy} setSortBy={setSortBy} />
      {searchResult && (
        <>
          <Items items={searchResult.items} opensNewTab={isPopup} />
          <Footer total={searchResult.total} />
        </>
      )}
    </main>
  );
}
