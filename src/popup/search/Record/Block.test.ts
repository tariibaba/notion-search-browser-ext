import { BLOCK_TYPE, TABLE_TYPE } from '../../constants';
import { Block } from './Block';
import { BlockCollectionView } from './BlockCollectionView';

const BLOCK: Response.Block = {
  id: 'block-id',
  parent_id: 'parent-id',
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};

afterEach(() => jest.restoreAllMocks());

for (const className of [Block, BlockCollectionView]) {
  describe(className.name as string, () => {
    test('detects an unknown block type', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(
        () =>
          new className({
            block: {
              ...BLOCK,
              type: 'unknown type' as BlockType,
            },
          }),
      ).not.toThrow();
      expect(spy).toHaveBeenCalledWith(
        expect.stringMatching(/Unknown block type:/),
        expect.anything(), // 省略できなそうにない、、 https://www.google.com/search?q=tohaveBeenCalledWith+first+argument
      );
    });
    describe('canBeDir', () => {
      test.each([
        { input: BLOCK_TYPE.PAGE, expected: true },
        { input: BLOCK_TYPE.COLLECTION_VIEW_PAGE, expected: true },
        { input: BLOCK_TYPE.COLLECTION_VIEW, expected: true },
        { input: BLOCK_TYPE.COLUMN_LIST, expected: false },
        { input: BLOCK_TYPE.COLUMN, expected: false },
        { input: 'unknown type' as BlockType, expected: false },
      ])('$input → $expected', ({ input, expected }) => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(
          new className({
            block: {
              ...BLOCK,
              type: input,
            },
          }).canBeDir,
        ).toBe(expected);
      });
    });
  });
}

describe('getTitle()', () => {
  test.each([
    {
      name: 'gets a title',
      input: { properties: { title: [['foo']] } },
      expected: 'foo',
    },
    {
      name: 'no title',
      input: {},
      expected: undefined,
    },
  ])('$name', ({ input, expected }) => {
    expect(
      new Block({
        block: {
          ...BLOCK,
          ...input,
        },
      }).getTitle(),
    ).toBe(expected);
  });
});

describe('getIcon()', () => {
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
      new Block({
        block: {
          ...BLOCK,
          ...input,
        },
      }).getIcon(),
    ).toBe(expected);
  });
});
