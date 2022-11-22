import React from 'react';
import Item from './Item';

export default function Items({
  opensNewTab,
  items,
}: {
  opensNewTab: boolean;
  items: Items;
}) {
  return items.length >= 0 ? (
    <div className="items">
      {items.map((item) => (
        <Item key={item.url} opensNewTab={opensNewTab} {...item}></Item>
      ))}
    </div>
  ) : null;
}