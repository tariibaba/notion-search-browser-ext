import { useEffect, useState } from 'react';
import {
  getLinkedWorkspace,
  LinkWorkspaceResult,
  selectAndLinkWorkspace,
  unlinkWorkspace,
} from './workspaces';

export const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
  const [error, setError] = useState<
    { message: string; error: unknown } | undefined
  >(undefined);
  const [hasGotWorkspace, setHasGotWorkspace] = useState(false);

  useEffect(() => {
    (async () => {
      let workspace: Workspace | undefined;
      try {
        workspace = await getLinkedWorkspace();
        if (workspace) setWorkspace(workspace);
      } catch (error) {
        /* TODO: cause を使う */
        setError({
          message: 'Failed to get workspaces. Please reload this page.',
          error,
        });
      }
      setHasGotWorkspace(true);
    })();
  }, []);

  return {
    workspace,
    // useEffect(() => { if (error) ... }, [error]); のように使う。 useEffect 省略不可
    error,
    hasGotWorkspace,
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
      if (result.hasAborted) {
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
