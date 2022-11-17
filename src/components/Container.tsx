import React, { useEffect, useState } from 'react';
import { MIN_QUERY_LENGTH, SortBy, STORAGE_KEY } from '../constants';
import { debouncedSearch } from '../search';
import Filter from './Filter';
import Footer from './Footer';
import Items from './Items';
import SearchBox from './SearchBox';
import Sort from './Sort';

export default function Container() {
  const isPopup = location.search === '?popup';
  const [renderable, setRenderable] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.RELEVANCE);
  const [filterBy, setFilterBy] = useState<FilterBy>(null);
  const [searchResult, setSearchResult] = useState<SearchResult>({
    items: [],
    total: 0,
  });
  const savesLastSearchResult = isPopup;
  const trimmedQuery = query.trim();
  const searchable = trimmedQuery.length >= MIN_QUERY_LENGTH;

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

  useEffect(() => {
    if (!searchable) return;

    (async () => {
      const result = await debouncedSearch({
        query: trimmedQuery,
        sortBy,
        filterBy,
        savesLastSearchResult,
      });
      if (result) setSearchResult(result);
    })();
  }, [trimmedQuery, sortBy, filterBy]);

  return renderable ? (
    <main>
      <SearchBox query={query} setQuery={setQuery} />
      <Filter filterBy={filterBy} setFilterBy={setFilterBy} />
      <Sort sortBy={sortBy} setSortBy={setSortBy} />
      {searchable && (
        <>
          <Items isPopup={isPopup} items={searchResult.items} />
          <Footer total={searchResult.total} />
        </>
      )}
    </main>
  ) : null;
}
