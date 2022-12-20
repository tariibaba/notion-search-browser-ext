import React from 'react';
import Item from '../Item';

export const Items = ({
  opensNewTab,
  query,
  items,
}: {
  opensNewTab: boolean;
  query: string;
  items: Item[];
}) => {
  return (
    <>
      {items.length >= 0 && (
        <div className="items">
          {items.map((item) => (
            <Item
              key={item.block.id}
              opensNewTab={opensNewTab}
              query={query}
              {...item}
            ></Item>
          ))}
        </div>
      )}
    </>
  );
};
