import { STORAGE_KEY } from './constants';
import { storage } from './storage';
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

export const linkSpace = async (): Promise<
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
  await storage.set({ [STORAGE_KEY.SPACE]: space });
  return {
    aborted: false,
    space,
  };
};

export const unlinkSpace = async () => {
  await storage.remove(STORAGE_KEY.SPACE);
};

export const getLinkedSpace = async (): Promise<Space> => {
  return (await storage.get(STORAGE_KEY.SPACE)) as Space; // TODO: 型ガード
};
