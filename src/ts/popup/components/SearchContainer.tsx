import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHashParam, useObjectHashParam } from 'use-hash-param';
import { storage } from '../../storage';
import { SortBy, STORAGE_KEY } from '../constants';
import { debouncedSearch } from '../search';
import Filter from './Filters';
import Footer from './Footer';
import Items from './Items';
import SearchBox from './SearchBox';
import Sort from './Sorts';

export default function Container({
  isPopup,
  space,
}: {
  isPopup: boolean;
  space: Space;
}) {
  const [query, setQuery] = useHashParam('query', '');
  const sortStateAndSetter = useHashParam('sort_by', SortBy.RELEVANCE);
  let [sortBy] = sortStateAndSetter;
  const [, setSortBy] = sortStateAndSetter;
  const [filtersBy, setFiltersBy] = useObjectHashParam<FiltersBy>(
    'filters_by',
    {},
  );
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>(
    undefined,
  );

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
        const store = (await storage.get(
          `${space.id}-${STORAGE_KEY.LAST_SEARCHED}`,
        )) as SearchResultCache | undefined; // TODO: 型ガード

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

      setSearchResult(
        await debouncedSearch({
          query: trimmedQuery,
          sortBy,
          filtersBy,
          savesLastSearchResult,
          spaceId: space.id,
        }),
      );
    })();
  }, [trimmedQuery, sortBy, filtersBy]);

  return (
    <main {...(isPopup && { className: 'is-popup' })}>
      <SearchBox query={query} setQuery={setQuery} spaceName={space.name} />
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
