import { render } from '@testing-library/react';
import React, { useState } from 'react';
import { $, userEventSetup } from '../../../../test/helpers';
import SearchBox from './SearchBox';

const Container = () => {
  const [query, setQuery] = useState('');
  return (
    <SearchBox
      setQuery={setQuery}
      query={query}
      workspaceName="workspace-name"
    />
  );
};

it('clears query', async () => {
  const user = userEventSetup();

  render(<Container />);
  const input = $('.query');

  await user.type(input, 'test');
  expect(input).toHaveValue('test');

  await user.click($('.test-clear-query'));
  expect(input).toHaveValue('');
});
