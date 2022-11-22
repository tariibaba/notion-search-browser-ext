import React from 'react';
import Item from './Item';

export default function Items({
  opensNewTab,
  items,
}: {
  opensNewTab: boolean;
  items: Items;
}) {
  return (
    <div
      className="items"
      // TODO: popup も高さ一定で良くない？
      style={
        opensNewTab
          ? { maxHeight: '470px' }
          : { maxHeight: 'calc(100vh - 215px)' }
      }
    >
      {items.map((item) => (
        <Item key={item.url} opensNewTab={opensNewTab} {...item}></Item>
      ))}
    </div>
  );
}
