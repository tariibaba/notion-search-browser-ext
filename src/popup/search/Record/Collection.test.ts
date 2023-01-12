import { TABLE_TYPE } from '../../constants';
import { Collection } from '../Record/Collection';

const COLLECTION: Response.Collection = {
  id: 'collection-id',
  parent_id: 'parent-id',
  parent_table: TABLE_TYPE.BLOCK,
};

describe('getTitle()', () => {
  test.each([
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
      new Collection({
        collection: {
          ...COLLECTION,
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
      new Collection({
        collection: {
          ...COLLECTION,
          ...input,
        },
      }).getIcon(),
    ).toBe(expected);
  });
});

test('canBeDir', () => {
  expect(
    new Collection({
      collection: COLLECTION,
    }).canBeDir,
  ).toBe(false);
});
