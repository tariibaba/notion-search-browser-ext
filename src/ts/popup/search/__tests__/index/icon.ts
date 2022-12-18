import { search } from '../..';
import { axios } from '../../../../axios';
import { NOTION_HOST } from '../../../../constants';
import { BLOCK_TYPE, ICON_TYPE, SORT_BY, TABLE_TYPE } from '../../../constants';
import { BlockClass } from '../../Record';

const BLOCK_ID = 'block-id';
const PARENT_BLOCK_ID = 'parent-id';
const BLOCK: Block = {
  id: BLOCK_ID,
  parent_id: PARENT_BLOCK_ID,
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};
const PARENT_BLOCK: Block = {
  id: PARENT_BLOCK_ID,
  parent_id: 'parent-id',
  parent_table: TABLE_TYPE.WORKSPACE,
  type: BLOCK_TYPE.PAGE,
};

afterEach(() => jest.restoreAllMocks());

describe('gets an icon', () => {
  it.each([
    {
      name: 'image (^http)',
      input: 'https://exmaple.com/icon.svg',
      expected: {
        type: ICON_TYPE.IMAGE,
        value: `${NOTION_HOST}/image/${encodeURIComponent(
          'https://exmaple.com/icon.svg',
        )}?table=block&id=${BLOCK_ID}&width=40`,
      },
    },
    {
      name: 'image (^/)',
      input: '/icon.svg',
      expected: {
        type: ICON_TYPE.IMAGE,
        value: `${NOTION_HOST}/icon.svg`,
      },
    },
    {
      name: 'emoji',
      input: '👌',
      expected: {
        type: ICON_TYPE.EMOJI,
        value: '👌',
      },
    },
  ])('$name', async ({ input, expected }) => {
    jest.spyOn(BlockClass.prototype, 'getIcon').mockReturnValue(input);
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        results: [{ id: BLOCK_ID }],
        recordMap: {
          block: {
            [BLOCK_ID]: {
              value: BLOCK,
            },
            [PARENT_BLOCK_ID]: {
              value: PARENT_BLOCK,
            },
          },
        },
        total: 0,
      },
    });
    expect(
      (
        await search({
          query: '',
          sortBy: SORT_BY.RELEVANCE,
          filtersBy: {},
          savesToStorage: false,
          workspaceId: 'spaceId',
        })
      ).items[0].icon,
    ).toEqual(expected);
  });
});
