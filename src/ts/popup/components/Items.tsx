import React from 'react';
import Item from './Item';

export default function Items({
  items,
  query,
  opensNewTab,
}: {
  items: Item[];
  query: string;
  opensNewTab: boolean;
}) {
  return (
    <>
      {items.length >= 0 && (
        <div className="items">
          {items.map((item) => (
            <Item
              key={item.url}
              query={query}
              opensNewTab={opensNewTab}
              {...item}
            ></Item>
          ))}
        </div>
      )}
    </>
  );
}
