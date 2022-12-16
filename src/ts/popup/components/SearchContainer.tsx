import React, { useEffect, useState } from 'react';
import { useHashParam, useObjectHashParam } from 'use-hash-param';
import { storage } from '../../storage';
import { alertError } from '../../utils';
import { SORT_BY, STORAGE_KEY } from '../constants';
import { debouncedSearch } from '../search';
import Filter from './Filters';
import Footer from './Footer';
import Items from './Items';
import SearchBox from './SearchBox';
import Sort from './Sorts';

export default function Container({
  isPopup,
  workspace,
}: {
  isPopup: boolean;
  workspace: Workspace;
}) {
  const [query, _setQuery] = useHashParam('query', '');
  // TODO: 外部化したいかも? ... いやほとんど抽象化できないか。。
  const setQuery = (query: string) => {
    if (query.trim() === '')
      storage.remove(`${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`);
    _setQuery(query);
  };

  const sortStateAndSetter = useHashParam('sort_by', SORT_BY.RELEVANCE);
  const [sortBy, setSortBy] = sortStateAndSetter;

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

  // search
  useEffect(() => {
    (async () => {
      // get cache
      // TODO: 一気通貫テストしたい（デグレしたので。。）
      if (isPopup && isFirstRendering) {
        const store = (await storage.get(
          `${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`,
        )) as SearchResultCache | undefined; // TODO: 型ガード

        if (store) {
          setIsFirstRendering(false);
          setQuery(store.query);
          setSearchResult(store.searchResult);
          return;
        }
      }
      setIsFirstRendering(false);

      try {
        setSearchResult(
          await debouncedSearch({
            query,
            sortBy:
              !hasQuery && sortBy === SORT_BY.RELEVANCE // ad hoc: worthless condition
                ? SORT_BY.CREATED
                : sortBy,
            filtersBy,
            savesToStorage: isPopup && hasQuery,
            workspaceId: workspace.id,
          }),
        );
      } catch (error) {
        alertError('Faled to search.', error);
        throw error;
      }
    })();
  }, [trimmedQuery, sortBy, filtersBy]);

  return (
    <div className={`wrapper ${isPopup ? 'is-popup' : ''}`}>
      <main>
        <SearchBox
          query={query}
          setQuery={setQuery}
          workspaceName={workspace.name}
        />
        <Filter filtersBy={filtersBy} setFiltersBy={setFiltersBy} />
        <Sort sortBy={sortBy} setSortBy={setSortBy} />
        {searchResult && (
          <>
            <Items items={searchResult.items} opensNewTab={isPopup} />
          </>
        )}
        <Footer
          total={searchResult?.total || 0}
          showsSummary={!!searchResult && hasQuery}
        />
      </main>
    </div>
  );
}
