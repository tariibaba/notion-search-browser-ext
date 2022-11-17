import React from 'react';
import Item from './Item';

export default function Items({
  isPopup,
  items,
}: {
  isPopup: boolean;
  items: Items;
}) {
  return (
    <div
      className="items"
      // TODO: popup も高さ一定で良くない？
      style={
        isPopup ? { maxHeight: '470px' } : { maxHeight: 'calc(100vh - 215px)' }
      }
    >
      {items.map((item) => (
        <Item key={item.url} opensNewTab={isPopup} {...item}></Item>
      ))}
    </div>
  );
}
