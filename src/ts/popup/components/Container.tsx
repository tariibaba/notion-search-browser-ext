import React, { useEffect, useState } from 'react';
import { getLinkedWorkspace, linkWorkspace } from '../../workspaces';
import SearchContainer from './SearchContainer';

// 後から足したくなるかもなので、今のところは boolean にしない
const LINKED_STATUS = {
  NOT_LINKED: 'NOT_CHECKED',
  LINKED: 'LINKED',
} as const;

export default function Container() {
  const [workspace, _setWorkspace] = useState<Workspace | undefined>(undefined);
  const [linkedStatus, setLinkedStatus] = useState<
    valueOf<typeof LINKED_STATUS>
  >(LINKED_STATUS.NOT_LINKED);

  const setSpace = (workspace: Workspace) => {
    _setWorkspace(workspace);
    setLinkedStatus(LINKED_STATUS.LINKED);
  };

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
      alert(
        `Failed to connect Notion. Please redo the operation later.\n(${error})`,
      );
      throw error;
    }
    if (result.aborted) {
      return;
    }
    setSpace(result.workspace);
  };

  useEffect(() => {
    (async () => {
      let workspace: Workspace | undefined;
      try {
        workspace = await getLinkedWorkspace();
      } catch (error) {
        // TODO: 国際化
        alert('Failed to get workspaces. Please reload this page.\n' + error);
        throw error;
      }
      if (workspace) {
        setSpace(workspace);
        return;
      }
      console.info('link automatically');
      await linkAndSetStatus();
    })();
  }, []);

  switch (linkedStatus) {
    case LINKED_STATUS.NOT_LINKED:
      return (
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
    case LINKED_STATUS.LINKED:
      if (!workspace)
        throw new Error('Status is linked, but workspace is undefined');

      return <SearchContainer isPopup={isPopup} workspace={workspace} />;
  }
}
