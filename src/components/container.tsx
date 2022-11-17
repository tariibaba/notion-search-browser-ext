import React, { useEffect, useState } from 'react';
import { MIN_QUERY_LENGTH, SortBy, STORAGE_KEY } from '../constants';
import { search } from '../search';
import Filter from './filter';
import Footer from './footer';
import Items from './items';
import SearchBox from './searchBox';
import Sort from './sort';

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
    if (query.length >= MIN_QUERY_LENGTH) {
      (async () => {
        setSearchResult(
          await search({ query, sortBy, filterBy, savesLastSearchResult }),
        );
      })();
    }
  }, [query, sortBy, filterBy]);

  return renderable ? (
    <main>
      <SearchBox query={query} setQuery={setQuery} />
      <Filter filterBy={filterBy} setFilterBy={setFilterBy} />
      <Sort sortBy={sortBy} setSortBy={setSortBy} />
      {query.length >= MIN_QUERY_LENGTH && (
        <>
          <Items isPopup={isPopup} items={searchResult.items} />
          <Footer total={searchResult.total} />
        </>
      )}
    </main>
  ) : null;
}
