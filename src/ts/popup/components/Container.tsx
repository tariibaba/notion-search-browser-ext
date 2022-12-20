import React, { useEffect, useState } from 'react';
import { alertError } from '../../utils';
import { getLinkedWorkspace, linkWorkspace } from '../../workspaces';
import SearchContainer from './SearchContainer';

export default function Container() {
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);

  const isPopup = location.search === '?popup';

  const linkAndSetStatus = async () => {
    let result:
      | {
          aborted: true;
        }
      | {
          aborted: false;
          workspace: Workspace;
        };
    try {
      result = await linkWorkspace();
    } catch (error) {
      alertError(
        'Failed to connect Notion. Please redo the operation later.',
        error,
      );
      throw error;
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
        alertError('Failed to get workspaces. Please reload this page.', error);
        throw error;
      }
      if (workspace) {
        setWorkspace(workspace);
        return;
      }
      console.info('link automatically');
      await linkAndSetStatus();
    })();
  }, []);

  if (workspace)
    return <SearchContainer isPopup={isPopup} workspace={workspace} />;

  return (
    // TODO: to .css
    <main style={{ width: '400px', height: '300px', padding: '20px' }}>
      <button
        onClick={(event) => {
          linkAndSetStatus();
          event.preventDefault();
        }}
      >
        Click here to connect Notion
      </button>
    </main>
  );
}
