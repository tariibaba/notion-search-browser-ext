import React, { useEffect, useState } from 'react';
import { useHashParam, useObjectHashParam } from 'use-hash-param';
import { storage } from '../../storage';
import { SORT_BY, STORAGE_KEY } from '../constants';
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
  const [query, _setQuery] = useHashParam('query', '');
  const setQuery = (query: string) => {
    if (query.trim() === '')
      storage.remove(`${space.id}-${STORAGE_KEY.LAST_SEARCHED}`);
    _setQuery(query);
  };

  const sortStateAndSetter = useHashParam('sort_by', SORT_BY.RELEVANCE);
  let [sortBy] = sortStateAndSetter;
  const [, setSortBy] = sortStateAndSetter;

  const [filtersBy, setFiltersBy] = useObjectHashParam<FiltersBy>(
    'filters_by',
    {},
  );
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>(
    undefined,
  );
  const [isFirstRendering, setIsFirstRendering] = useState<boolean>(true);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const usesLastSearchResult = isPopup && hasQuery;

  // search
  useEffect(() => {
    (async () => {
      // get cache
      // TODO: 一気通貫テストしたい（デグレしたので。。）
      if (usesLastSearchResult && isFirstRendering) {
        const store = (await storage.get(
          `${space.id}-${STORAGE_KEY.LAST_SEARCHED}`,
        )) as SearchResultCache | undefined; // TODO: 型ガード

        if (store) {
          setIsFirstRendering(false);
          setQuery(store.query);
          setSearchResult(store.searchResult);
          return;
        }
      }
      setIsFirstRendering(false);

      // ad hoc: query == '' && sort == 'relevance' is worthless
      if (!hasQuery && sortBy === SORT_BY.RELEVANCE) sortBy = SORT_BY.CREATED;

      setSearchResult(
        await debouncedSearch({
          query: trimmedQuery,
          sortBy,
          filtersBy,
          usesLastSearchResult,
          spaceId: space.id,
        }),
      );
    })();
  }, [trimmedQuery, sortBy, filtersBy]);

  return (
    <div className={`wrapper ${isPopup ? 'is-popup' : ''}`}>
      <main>
        <SearchBox query={query} setQuery={setQuery} spaceName={space.name} />
        <Filter filtersBy={filtersBy} setFiltersBy={setFiltersBy} />
        <Sort sortBy={sortBy} setSortBy={setSortBy} />
        {searchResult && (
          <>
            <Items items={searchResult.items} opensNewTab={isPopup} />
          </>
        )}
        <Footer total={searchResult && searchResult.total} />
      </main>
    </div>
  );
}
