import { BLOCK_TYPE, TABLE_TYPE } from '../constants';
import { BlockNotCollectionView } from './NotCollectionView';

const BLOCK: SearchApi.Block = {
  id: 'block-id',
  parent_id: 'parent-id',
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};

afterEach(() => jest.restoreAllMocks());

describe('unknown block type', () => {
  test.each([
    {
      input: 'unknown type' as SearchApi.BlockType,
      expected: /^Unknown block type/,
    },
    {
      input: BLOCK_TYPE.COLLECTION_VIEW,
      expected: /^Collection view/,
    },
    {
      input: BLOCK_TYPE.COLLECTION_VIEW_PAGE,
      expected: /^Collection view/,
    },
    {
      input: BLOCK_TYPE.PAGE,
      expected: undefined,
    },
  ])('$input', ({ input, expected }) => {
    if (expected === undefined) {
      expect(
        () =>
          new BlockNotCollectionView({
            block: {
              ...BLOCK,
              type: input,
            },
          }),
      ).not.toThrow();
    } else {
      expect(
        () =>
          new BlockNotCollectionView({
            block: {
              ...BLOCK,
              type: input,
            },
          }),
      ).toThrow(expected);
    }
  });
});

describe('canBeDir', () => {
  test.each([
    { input: BLOCK_TYPE.PAGE, expected: true },
    { input: BLOCK_TYPE.COLUMN_LIST, expected: false },
    { input: BLOCK_TYPE.COLUMN, expected: false },
    { input: BLOCK_TYPE.TOGGLE, expected: false },
    { input: BLOCK_TYPE.TEXT, expected: false },
  ])('$input → $expected', ({ input, expected }) => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(
      new BlockNotCollectionView({
        block: {
          ...BLOCK,
          type: input,
        },
      }).canBeDir(),
    ).toBe(expected);
  });
});

describe('title', () => {
  test.each([
    {
      name: 'gets a title',
      input: {
        properties: {
          title: [['foo']],
        },
      },
      expected: 'foo',
    },
    {
      name: 'gets a title from a multi-dimensional array',
      input: {
        properties: {
          title: [['foo', [['bar']]], ['baz']],
        },
      },
      expected: 'foobaz',
    },
    {
      name: 'gets a title from a multi-dimensional array (2)',
      input: {
        properties: {
          title: [['foo', [['bar']]]],
        },
      },
      expected: 'foo',
    },
    {
      name: 'gets no title from an empty object',
      input: {},
      expected: undefined,
    },
    {
      name: 'gets no title from an array other than title',
      input: {
        properties: {
          bar: [['https://example.com/']],
        },
      },
      expected: undefined,
    },
  ])('$name', ({ input, expected }) => {
    expect(
      new BlockNotCollectionView({
        block: {
          ...BLOCK,
          ...input,
        } as SearchApi.BlockNotCollectionView,
      }).title,
    ).toBe(expected);
  });
});

describe('icon', () => {
  test.each([
    {
      name: 'gets a icon',
      input: { format: { page_icon: 'https://example.com/icon.png' } },
      expected: 'https://example.com/icon.png',
    },
    {
      name: "no icon (.format.page_icon doesn't exist)",
      input: { format: {} },
      expected: undefined,
    },
    {
      name: "no icon (.format doesn't exist)",
      input: {},
      expected: undefined,
    },
  ])('$name', ({ input, expected }) => {
    expect(
      new BlockNotCollectionView({
        block: {
          ...BLOCK,
          ...input,
        },
      }).icon,
    ).toBe(expected);
  });
});
