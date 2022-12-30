import { BLOCK_TYPE, TABLE_TYPE } from '../../constants';
import { BlockClass } from './Block';
import { BlockCollectionViewClass } from './BlockCollectionView';
import { CollectionClass } from './Collection';
import { createBlock, createRecord } from './factory';

const BLOCK_ID = 'block-id';
const BLOCK: Block = {
  id: BLOCK_ID,
  parent_id: 'parent-block-id',
  parent_table: TABLE_TYPE.BLOCK,
  type: BLOCK_TYPE.PAGE,
};

const COLLECTION_ID = 'yyy';
const COLLECTION: Collection = {
  id: COLLECTION_ID,
  parent_id: 'parent-collection-id',
  parent_table: TABLE_TYPE.BLOCK,
};

const RECORD_MAP: RecordMap = {
  block: {
    [BLOCK_ID]: {
      value: BLOCK,
    },
  },
  collection: {
    [COLLECTION_ID]: {
      value: COLLECTION,
    },
  },
};

afterEach(() => jest.restoreAllMocks());

describe('createRecord()', () => {
  describe('normal', () => {
    it('gets a block', () =>
      expect(
        createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, RECORD_MAP),
      ).toBeInstanceOf(BlockClass));

    for (const type of [
      BLOCK_TYPE.COLLECTION_VIEW,
      BLOCK_TYPE.COLLECTION_VIEW_PAGE,
    ]) {
      describe(`gets a block (${type})`, () => {
        it('a block has a collection', () => {
          const block = createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, {
            ...RECORD_MAP,
            block: {
              [BLOCK_ID]: {
                value: {
                  ...BLOCK,
                  type,
                  collection_id: COLLECTION_ID,
                },
              },
            },
          });
          expect(block).toBeInstanceOf(BlockCollectionViewClass);
          expect((block as BlockCollectionViewClass).collection).toBeDefined();
        });
        it("a block doesn't have a collection", () => {
          const block = createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, {
            ...RECORD_MAP,
            block: {
              [BLOCK_ID]: {
                value: {
                  ...BLOCK,
                  type,
                },
              },
            },
          });
          expect(block).toBeInstanceOf(BlockCollectionViewClass);
          expect(
            (block as BlockCollectionViewClass).collection,
          ).toBeUndefined();
        });
      });
    }

    it('gets a collection', () =>
      expect(
        createRecord(COLLECTION_ID, TABLE_TYPE.COLLECTION, RECORD_MAP),
      ).toBeInstanceOf(CollectionClass));
  });

  describe('abnormal', () => {
    it('unknown table type', () =>
      expect(() =>
        createRecord(BLOCK_ID, 'unknown table type' as TableType, RECORD_MAP),
      ).toThrow(/^Unknown table type:/));

    it("can't handle a workspace", () =>
      expect(() =>
        createRecord(BLOCK_ID, TABLE_TYPE.WORKSPACE, RECORD_MAP),
      ).toThrow(/^Can't handle a workspace/));

    it("block-id doesn't exist", () =>
      expect(() =>
        createRecord("id that doesn't exist", TABLE_TYPE.BLOCK, RECORD_MAP),
      ).toThrow(/^Block .+ is not found/));

    it("collection id doesn't exist (collection)", () =>
      expect(() =>
        createRecord(
          "id that doesn't exist",
          TABLE_TYPE.COLLECTION,
          RECORD_MAP,
        ),
      ).toThrow(/^Collection .+ is not found/));

    for (const type of [
      BLOCK_TYPE.COLLECTION_VIEW,
      BLOCK_TYPE.COLLECTION_VIEW_PAGE,
    ]) {
      it(`collection id doesn't exist (${type})`, () => {
        expect(() =>
          createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, {
            ...RECORD_MAP,
            block: {
              [BLOCK_ID]: {
                value: {
                  ...BLOCK,
                  type,
                  collection_id: "id that doesn't exist",
                },
              },
            },
          }),
        ).toThrow(
          /block.collection_id exists, but collection_id:.+ is not found/,
        );
      });
    }

    it('unknow block type', () => {
      /* eslint @typescript-eslint/no-empty-function: 0 */
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      createRecord(BLOCK_ID, TABLE_TYPE.BLOCK, {
        ...RECORD_MAP,
        block: {
          [BLOCK_ID]: {
            value: {
              ...BLOCK,
              type: 'unknown block type' as BlockType,
            },
          },
        },
      });
      expect(spy).toHaveBeenCalledWith(
        expect.stringMatching(/Unknown block type:/),
        expect.anything(),
      );
    });
  });
});

describe('createBlock()', () => {
  it('gets a block', () =>
    expect(createBlock(BLOCK_ID, RECORD_MAP)).toBeInstanceOf(BlockClass));
});
