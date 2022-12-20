import { BLOCK_TYPE, TABLE_TYPE } from '../../constants';
import { BlockClass } from '../Record/Block';

const BLOCK: Block = {
  id: 'block-id',
  parent_id: 'parent-id',
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};

describe('parent', () => {
  const parent = new BlockClass({
    block: BLOCK,
  }).parent;

  it('gets an id', () => {
    expect(parent.id).toBe('parent-id');
  });

  it('gets a table type', () => {
    expect(parent.tableType).toBe(TABLE_TYPE.BLOCK);
  });

  describe('isWorkspace', () => {
    it.each([
      { input: TABLE_TYPE.BLOCK, expected: false },
      { input: TABLE_TYPE.COLLECTION, expected: false },
      { input: TABLE_TYPE.WORKSPACE, expected: true },
    ])('$input → $expected', ({ input, expected }) => {
      expect(
        new BlockClass({
          block: {
            ...BLOCK,
            parent_table: input,
          },
        }).parent.isWorkspace,
      ).toBe(expected);
    });
  });
});
