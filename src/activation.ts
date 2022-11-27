import { STORAGE_KEY } from './constants';
import { axios } from './utils/axios';

const PATH = '/getSpaces';

type GetSpacesResponse = {
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

export const activate = async (): Promise<
  { aborted: true } | { aborted: false; space: Space }
> => {
  const spaces: Space[] = [];
  const res = (await axios.post<GetSpacesResponse>(PATH)).data;
  for (const { space: spacesObj } of Object.values(res)) {
    for (const [spaceId, value] of Object.entries(spacesObj)) {
      spaces.push({
        id: spaceId,
        name: value.value.name,
      });
    }
  }
  let space: Space | undefined = undefined;
  switch (spaces.length) {
    case 0:
      throw new Error('No spaces are found');
    case 1:
      space = spaces[0];
      break;
    default: {
      while (!space) {
        const answer = prompt(
          'Select your Notion space by number:\n' +
            spaces.map((space, i) => `    ${i + 1}. ${space.name}`).join('\n'),
          '1',
        );
        if (answer === null) return { aborted: true };

        space = spaces[answerToIndex(answer) - 1];
      }
    }
  }
  try {
    await chrome.storage.local.set({
      [STORAGE_KEY.SPACE]: space,
    });
  } catch (error) {
    throw new Error(`chrome.storage.local.set() failed. error: ${error}`);
  }
  return {
    aborted: false,
    space,
  };
};

export const deactivate = async () => {
  try {
    await chrome.storage.local.remove(STORAGE_KEY.SPACE);
  } catch (error) {
    throw new Error(`chrome.storage.local.set() failed. error: ${error}`);
  }
};

export const getSpaceFromCache = async (): Promise<Space | undefined> =>
  (await chrome.storage.local.get(STORAGE_KEY.SPACE))[STORAGE_KEY.SPACE];
