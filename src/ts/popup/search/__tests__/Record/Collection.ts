import { TABLE_TYPE } from '../../../constants';
import { CollectionClass } from '../../Record';

const COLLECTION: Collection = {
  id: 'xxx',
  parent_id: 'parent-xxx',
  parent_table: TABLE_TYPE.BLOCK,
};

describe('getTitle()', () => {
  it.each([
    {
      name: 'gets a title',
      input: { name: [['foo']] },
      expected: 'foo',
    },
    {
      name: 'no title',
      input: {},
      expected: undefined,
    },
  ])('$name', ({ input, expected }) => {
    expect(
      new CollectionClass({
        collection: {
          ...COLLECTION,
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
      input: { icon: 'https://example.com/icon.png' },
      expected: 'https://example.com/icon.png',
    },
    {
      name: 'no icon',
      input: {},
      expected: undefined,
    },
  ])('$name', ({ input, expected }) => {
    expect(
      new CollectionClass({
        collection: {
          ...COLLECTION,
          ...input,
        },
      }).getIcon(),
    ).toBe(expected);
  });
});

it('canBeDir', () => {
  expect(
    new CollectionClass({
      collection: COLLECTION,
    }).canBeDir,
  ).toBe(false);
});
