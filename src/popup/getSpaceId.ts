import { axios } from '../utils/axios';

const PATH = '/api/v3/getSpaces';

type GetSpacesResponse = {
  [userId: string]: {
    space: {
      [spaceId: string]: {
        value: { name: string };
      };
    };
  };
};

type Space = { id: string; name: string };

const answerToInt = (str: string) => {
  str = str
    .trim()
    .replace(/[０-９]/g, (str) =>
      String.fromCharCode(str.charCodeAt(0) - 65248),
    );
  const int = parseInt(str);
  return isNaN(int) ? null : int;
};

export const getSpaceId = async () => {
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
  switch (spaces.length) {
    case 0:
      throw new Error('No spaces are found');
    case 1:
      return spaces[0].id;
    default: {
      let num: number | undefined = undefined;
      while (!num || !spaces[num - 1]) {
        const answer = prompt(
          'Select your Notion space by number:\n' +
            spaces.map((space, i) => `    ${i + 1}. ${space.name}`).join('\n'),
          '1',
        );
        if (answer === null) return null;

        const int = answerToInt(answer);
        if (!int) continue;
        num = int;
      }
      return spaces[num - 1].id;
    }
  }
};
