import React from 'react';
import Item from '../Item';

export const Items = ({
  isPopup,
  query,
  items,
}: {
  isPopup: boolean;
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
              isPopup={isPopup}
              query={query}
              {...item}
            ></Item>
          ))}
        </div>
      )}
    </>
  );
};
