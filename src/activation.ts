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

const answerToInt = (str: string) => {
  str = str
    .trim()
    .replace(/[０-９]/g, (str) =>
      String.fromCharCode(str.charCodeAt(0) - 65248),
    );
  const int = parseInt(str);
  return isNaN(int) ? null : int;
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
  let index: number;
  switch (spaces.length) {
    case 0:
      throw new Error('No spaces are found');
    case 1:
      index = 0;
      break;
    default: {
      let num: number | undefined = undefined;
      while (!num || !spaces[num - 1]) {
        const answer = prompt(
          'Select your Notion space by number:\n' +
            spaces.map((space, i) => `    ${i + 1}. ${space.name}`).join('\n'),
          '1',
        );
        if (answer === null) return { aborted: true };

        const int = answerToInt(answer);
        if (!int) continue;
        num = int;
      }
      index = num - 1;
    }
  }
  const space = spaces[index];
  try {
    await chrome.storage.local.set({
      [STORAGE_KEY.SPACE]: space,
    });
  } catch (error) {
    throw new Error(`Failed to set data to storage.local. error: ${error}`);
  }
  return {
    aborted: false,
    space,
  };
};

export const getSpaceFromCache = async (): Promise<Space | null> =>
  (await chrome.storage.local.get(STORAGE_KEY.SPACE))[STORAGE_KEY.SPACE] ||
  null;
