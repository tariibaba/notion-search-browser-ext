import { BlockNotCollectionView } from '../Record/Block/NotCollectionView';
import { BLOCK_TYPE, TABLE_TYPE } from './constants';

const BLOCK: SearchApi.Block = {
  id: 'block-id',
  parent_id: 'parent-id',
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};

describe('parent', () => {
  const parent = new BlockNotCollectionView({
    block: BLOCK,
  }).parent;

  test('gets an id', () => {
    expect(parent.id).toBe('parent-id');
  });

  test('gets a table type', () => {
    expect(parent.tableType).toBe(TABLE_TYPE.BLOCK);
  });

  describe('isWorkspace', () => {
    test.each([
      { input: TABLE_TYPE.BLOCK, expected: false },
      { input: TABLE_TYPE.COLLECTION, expected: false },
      { input: TABLE_TYPE.WORKSPACE, expected: true },
    ])('$input → $expected', ({ input, expected }) => {
      expect(
        new BlockNotCollectionView({
          block: {
            ...BLOCK,
            parent_table: input,
          },
        }).parent.isWorkspace,
      ).toBe(expected);
    });
  });
});
