import React from 'react';
import Item from './item';

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
      style={isPopup ? {} : { maxHeight: 'calc(100vh - 135px)' }}
    >
      {items.map((item) => (
        <Item key={item.url} opensNewTab={isPopup} {...item}></Item>
      ))}
      `;
    </div>
  );
}
