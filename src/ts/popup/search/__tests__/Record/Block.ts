import { BLOCK_TYPE, TABLE_TYPE } from '../../../constants';
import { BlockClass } from '../../Record';

const BLOCK: Block = {
  id: 'xxx',
  parent_id: 'parent-xxx',
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};

it('detects unknown block type', () => {
  /* eslint @typescript-eslint/no-empty-function: 0 */
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  expect(
    () =>
      new BlockClass({
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

describe('getTitle()', () => {
  it.each([
    {
      name: 'gets a title',
      input: { properties: { title: [['foo']] } },
      expected: 'foo',
    },
    {
      name: 'gets a undefined title',
      input: {},
      expected: undefined,
    },
  ])('$name', ({ input, expected }) => {
    expect(
      new BlockClass({
        block: {
          ...BLOCK,
          ...input,
        },
      }).getTitle(),
    ).toBe(expected);
  });
});

describe('getIcon()', () => {
  it.each([
    {
      name: 'gets a icon',
      input: { format: { page_icon: 'https://example.com/icon.png' } },
      expected: 'https://example.com/icon.png',
    },
    {
      name: "gets a undefined icon (.format.page_icon doesn't exist)",
      input: { format: {} },
      expected: undefined,
    },
    {
      name: "gets a undefined icon (.format doesn't exist)",
      input: {},
      expected: undefined,
    },
  ])('$name', ({ input, expected }) => {
    expect(
      new BlockClass({
        block: {
          ...BLOCK,
          ...input,
        },
      }).getIcon(),
    ).toBe(expected);
  });
});
describe('canBeDir', () => {
  it.each([
    { input: BLOCK_TYPE.PAGE, expected: true },
    { input: BLOCK_TYPE.COLLECTION_VIEW_PAGE, expected: true },
    { input: BLOCK_TYPE.COLLECTION_VIEW, expected: true },
    { input: BLOCK_TYPE.COLUMN_LIST, expected: false },
    { input: BLOCK_TYPE.COLUMN, expected: false },
    { input: 'unknown type' as BlockType, expected: false },
  ])('$input → $expected', ({ input, expected }) => {
    expect(
      new BlockClass({
        block: {
          ...BLOCK,
          type: input,
        },
      }).canBeDir,
    ).toBe(expected);
  });
});
