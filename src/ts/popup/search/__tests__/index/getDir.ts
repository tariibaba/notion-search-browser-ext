import { search } from '../..';
import { axios } from '../../../../axios';
import { BLOCK_TYPE, SORT_BY, TABLE_TYPE } from '../../../constants';
import { BlockClass } from '../../Record';

afterEach(() => jest.restoreAllMocks());

const CHILD_ID = 'block-id';
const PARENT_ID = 'parent-id';
const GRANDPARENT_ID = 'grandparent-id';

describe('gets dirs', () => {
  it.each([
    {
      name: 'no ancestors',
      input: {
        block: {
          [CHILD_ID]: {
            value: {
              id: CHILD_ID,
              parent_id: PARENT_ID,
              parent_table: TABLE_TYPE.WORKSPACE,
              type: BLOCK_TYPE.PAGE,
            },
          },
        },
      },
      expected: [],
    },
    {
      name: 'single ancestor',
      input: {
        block: {
          [CHILD_ID]: {
            value: {
              id: CHILD_ID,
              parent_id: PARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.PAGE,
            },
          },
          [PARENT_ID]: {
            value: {
              id: PARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.WORKSPACE,
              type: BLOCK_TYPE.PAGE,
            },
          },
        },
      },
      expected: [`Title of ${PARENT_ID}`],
    },
    {
      name: 'multiple ancestors',
      input: {
        block: {
          [CHILD_ID]: {
            value: {
              id: CHILD_ID,
              parent_id: PARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.PAGE,
            },
          },
          [PARENT_ID]: {
            value: {
              id: PARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.PAGE,
            },
          },
          [GRANDPARENT_ID]: {
            value: {
              id: GRANDPARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.WORKSPACE,
              type: BLOCK_TYPE.PAGE,
            },
          },
        },
      },
      expected: [`Title of ${GRANDPARENT_ID}`, `Title of ${PARENT_ID}`],
    },
    {
      name: 'skipped blocks',
      input: {
        block: {
          [CHILD_ID]: {
            value: {
              id: CHILD_ID,
              parent_id: PARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.PAGE,
            },
          },
          [PARENT_ID]: {
            value: {
              id: PARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.BLOCK,
              type: BLOCK_TYPE.COLUMN,
            },
          },
          [GRANDPARENT_ID]: {
            value: {
              id: GRANDPARENT_ID,
              parent_id: GRANDPARENT_ID,
              parent_table: TABLE_TYPE.WORKSPACE,
              type: BLOCK_TYPE.PAGE,
            },
          },
        },
      },
      expected: [`Title of ${GRANDPARENT_ID}`],
    },
  ])('$name', async ({ input, expected }) => {
    jest
      .spyOn(BlockClass.prototype, 'getTitle')
      .mockImplementation(function (this: BlockClass) {
        return `Title of ${this.record.id}`;
      });

    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        results: [{ id: CHILD_ID }],
        recordMap: input,
        total: 0,
      },
    });
    const items = (
      await search({
        query: '',
        sortBy: SORT_BY.RELEVANCE,
        filtersBy: {},
        savesToStorage: false,
        workspaceId: 'spaceId',
      })
    ).items[0];
    expect(items.dirs.map((dir) => dir.title)).toEqual(expected);
  });
});
