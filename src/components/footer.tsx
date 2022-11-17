import React from 'react';
import { SEARCH_LIMIT } from '../constants';

export default function Total({ total }: { total: number }) {
  return (
    <div className="summary">
      {total > SEARCH_LIMIT && (
        <>
          <span className="total">${SEARCH_LIMIT}</span> of{' '}
        </>
      )}
      <span className="total">${total}</span> results
    </div>
  );
}
