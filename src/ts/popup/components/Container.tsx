import React, { useEffect, useState } from 'react';
import { alertError } from '../../utils';
import {
  getLinkedWorkspace,
  LinkWorkspaceResult,
  selectAndLinkWorkspace as _selectAndLinkWorkspace,
} from '../../workspaces';
import SearchContainer from './SearchContainer';

const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
  const [error, setError] = useState<
    { message: string; error: unknown } | undefined
  >(undefined);

  const selectAndLinkWorkspace = async () => {
    let result: LinkWorkspaceResult;
    try {
      result = await _selectAndLinkWorkspace();
    } catch (error) {
      setError({
        message: 'Failed to connect Notion. Please redo the operation later.',
        error,
      });
      return;
    }
    if (result.aborted) {
      return;
    }
    setWorkspace(result.workspace);
  };

  useEffect(() => {
    (async () => {
      let workspace: Workspace | undefined;
      try {
        workspace = await getLinkedWorkspace();
      } catch (error) {
        setError({
          message: 'Failed to get workspaces. Please reload this page.',
          error,
        });
        return;
      }
      if (workspace) {
        setWorkspace(workspace);
        return;
      }
      console.info('will link automatically');
      await selectAndLinkWorkspace();
    })();
  }, []);
  return { workspace, error, selectAndLinkWorkspace };
};

export default function Container() {
  const { workspace, error, selectAndLinkWorkspace } = useWorkspace();
  if (error) {
    alertError(
      'Failed to connect Notion. Please redo the operation later.',
      error,
    );
    throw error;
  }
  const isPopup = location.search === '?popup';

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
}
