import { axios } from './axios';
import { STORAGE_KEY } from './constants';
import { storage } from './storage';

const PATH = '/getSpaces';

type GetWorkspacesApiResponse = {
  [userId: string]: {
    space: {
      [spaceId: string]: {
        value: { name: string };
      };
    };
  };
};

export const answerToIndex = (str: string) => {
  str = str
    .trim()
    .replace(/[０-９]/g, (str) =>
      String.fromCharCode(str.charCodeAt(0) - 65248),
    );
  return parseInt(str);
};

// TODO: テストどうする...? ( prompt() の stub が少々だるいが)
export type LinkWorkspaceResult =
  | { hasAborted: true }
  | { hasAborted: false; workspace: Workspace };

export const selectAndLinkWorkspace =
  async (): Promise<LinkWorkspaceResult> => {
    const workspaces: Workspace[] = [];
    const res = (await axios.post<GetWorkspacesApiResponse>(PATH)).data;
    for (const { space: workspacesObj } of Object.values(res)) {
      for (const [workspaceId, value] of Object.entries(workspacesObj)) {
        workspaces.push({
          id: workspaceId,
          name: value.value.name,
        });
      }
    }
    let workspace: Workspace | undefined = undefined;
    switch (workspaces.length) {
      case 0:
        throw new Error('No spaces are found');
      case 1:
        workspace = workspaces[0];
        break;
      default: {
        while (!workspace) {
          const answer = prompt(
            'Select your workspace by number:\n' +
              workspaces
                .map((workspace, i) => `    ${i + 1}. ${workspace.name}`)
                .join('\n'),
            '1',
          );
          if (answer === null) return { hasAborted: true };

          workspace = workspaces[answerToIndex(answer) - 1];
        }
      }
    }
    await storage.set({ [STORAGE_KEY.WORKSPACE]: workspace });
    return {
      hasAborted: false,
      workspace: workspace,
    };
  };

export const unlinkWorkspace = async () => {
  await storage.remove(STORAGE_KEY.WORKSPACE);
};

export const getLinkedWorkspace = async (): Promise<Workspace | undefined> => {
  const workspace = await storage.get(STORAGE_KEY.WORKSPACE);
  return workspace ? (workspace as Workspace) : undefined;
};
