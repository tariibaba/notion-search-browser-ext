import React, { useEffect, useRef, useState } from 'react';
import {
  BooleanParam,
  StringParam,
  useQueryParam,
  withDefault,
} from 'use-query-params';
import { storage } from '../../../storage';
import { alertError } from '../../../utils';
import { SORT_BY, STORAGE_KEY } from '../../constants';
import { debouncedSearch, search } from '../../search';
import { SearchBox } from '../SearchBox';
import { Sort } from '../Sorts';
import { Filter } from './../Filters';
import { Footer } from './../Footer';
import { Items } from './../Items';

export const SearchContainer = ({
  isPopup,
  workspace,
}: {
  isPopup: boolean;
  workspace: Workspace;
}) => {
  const [query, setQuery] = useQueryParam(
    'query',
    withDefault(StringParam, ''),
  );
  const [sortBy, setSortBy] = useQueryParam(
    'sort_by',
    withDefault(StringParam, SORT_BY.RELEVANCE),
  );
  const [filterOnlyTitles, setFilterOnlyTitles] = useQueryParam(
    'only_titles',
    withDefault(BooleanParam, false),
  );

  const [usedQuery, setUsedQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>(
    undefined,
  );

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const isFirstRendering = useRef(true);

  // search
  useEffect(() => {
    (async () => {
      // get cache
      if (isPopup && isFirstRendering.current) {
        isFirstRendering.current = false;

        const store = (await storage.get(
          `${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`,
        )) as SearchResultCache | undefined; // TODO: 型ガード

        if (store) {
          setQuery(store.query);
          setUsedQuery(query);
          setSearchResult(store.searchResult);
          return;
        }
      }

      if (query.trim() === '')
        storage.remove(`${workspace.id}-${STORAGE_KEY.LAST_SEARCHED}`);

      try {
        setSearchResult(
          await (hasQuery ? debouncedSearch : search)({
            query,
            sortBy:
              !hasQuery && sortBy === SORT_BY.RELEVANCE // ad hoc: worthless condition
                ? SORT_BY.CREATED // 別に last edited でも良いのだが
                : sortBy,
            filterOnlyTitles,
            savesToStorage: isPopup && hasQuery,
            workspaceId: workspace.id,
          }),
        );
        setUsedQuery(query);
      } catch (error) {
        alertError('Faled to search.', error);
        throw error;
      }
    })();
  }, [trimmedQuery, sortBy, filterOnlyTitles]);

  return (
    <div className={`wrapper ${isPopup ? 'is-popup' : ''}`}>
      <main>
        <SearchBox
          query={query}
          setQuery={setQuery}
          workspaceName={workspace.name}
        />
        <Filter
          filterOnlyTitles={filterOnlyTitles}
          setFilterOnlyTitles={setFilterOnlyTitles}
        />
        <Sort sortBy={sortBy} setSortBy={setSortBy} />
        {searchResult && (
          <>
            <Items
              items={searchResult.items}
              opensNewTab={isPopup}
              query={usedQuery}
            />
          </>
        )}
        <Footer
          total={searchResult?.total || 0}
          showsSummary={!!searchResult && hasQuery}
        />
      </main>
    </div>
  );
};
