import { useEffect, useState } from 'react';
import {
  getLinkedWorkspace,
  LinkWorkspaceResult,
  selectAndLinkWorkspace,
  unlinkWorkspace,
} from './workspaces';

/* TODO: テスト。。
   - (最初は isInitialized = false
   - initialize
     - getLinkedWorkspace が resolve した場合
     - getLinkedWorkspace が reject した場合
   - selectAndLinkWorkspace
     - selectAndLinkWorkspace が resolve した場合
     - selectAndLinkWorkspace が reject した場合
*/
export const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
  const [error, setError] = useState<
    { message: string; error: unknown } | undefined
  >(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      setIsInitialized(true);

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
      if (workspace) setWorkspace(workspace);
    })();
  }, []);

  return {
    workspace,
    error,
    isInitialized,
    selectAndLinkWorkspace: async () => {
      let result: LinkWorkspaceResult;
      try {
        result = await selectAndLinkWorkspace();
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
    },
    unlinkWorkspace: async () => {
      await unlinkWorkspace();
      setWorkspace(undefined);
    },
  };
};
