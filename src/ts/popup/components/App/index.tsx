import React, { useEffect } from 'react';
import { useWorkspace } from '../../../hooks';
import { alertError } from '../../../utils';
import { SearchContainer } from '../SearchContainer';

export const App = () => {
  const { workspace, hasGotWorkspace, error, selectAndLinkWorkspace } =
    useWorkspace();

  if (error) {
    alertError(
      'Failed to connect Notion. Please redo the operation later.',
      error,
    );
    throw error;
  }
  const isPopup = new URL(location.href).searchParams.has('popup');

  useEffect(() => {
    (async () => {
      if (hasGotWorkspace && !workspace) {
        console.info('will link automatically');
        await selectAndLinkWorkspace();
      }
    })();
  }, [hasGotWorkspace]);

  if (workspace)
    return <SearchContainer isPopup={isPopup} workspace={workspace} />;

  return (
    // TODO: to .css
    <main style={{ width: '400px', height: '300px', padding: '20px' }}>
      <button
        onClick={(event) => {
          selectAndLinkWorkspace();
          event.preventDefault();
        }}
      >
        Click here to connect Notion
      </button>
    </main>
  );
};
