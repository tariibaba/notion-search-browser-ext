import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider as OrigQueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

export const QueryParamProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <BrowserRouter>
    <OrigQueryParamProvider adapter={ReactRouter6Adapter}>
      {children}
    </OrigQueryParamProvider>
  </BrowserRouter>
);
