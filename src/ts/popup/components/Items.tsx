import React from 'react';
import Item from './Item';

export default function Items({
  opensNewTab,
  query,
  items,
}: {
  opensNewTab: boolean;
  query: string;
  items: Item[];
}) {
  return (
    <>
      {items.length >= 0 && (
        <div className="items">
          {items.map((item) => (
            <Item
              key={item.url}
              opensNewTab={opensNewTab}
              query={query}
              {...item}
            ></Item>
          ))}
        </div>
      )}
    </>
  );
}
