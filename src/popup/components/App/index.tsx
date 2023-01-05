import React, { useEffect } from 'react';
import { useWorkspace } from '../../../hooks';
import { alertError } from '../../../utils';
import { SearchContainer } from '../SearchContainer';
import './styles.pcss';

export const App = () => {
  const { workspace, hasGotWorkspace, error, selectAndLinkWorkspace } =
    useWorkspace();

  useEffect(() => {
    if (error) {
      alertError(error.message, error.cause);
      throw error.cause;
    }
  }, [error]);

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
    <div className="link-button-container">
      <button
        onClick={(event) => {
          selectAndLinkWorkspace();
          event.preventDefault();
        }}
      >
        Click here to connect Notion
      </button>
    </div>
  );
};
