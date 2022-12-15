// NOTE: このファイルに仕様のメモはしない。 するなら apiResponse.d.ts に

import { BLOCK_TYPE, CAN_BE_DIR, TABLE_TYPE } from '../constants';

export class RecordError extends Error {
  data: object;
  constructor(message: string, data: object) {
    super(message);
    this.name = this.constructor.name;
    this.data = data;
  }
}

const getBlock = (recordMap: RecordMap, id: string): Block | undefined =>
  recordMap.block[id]?.value;

const getCollection = (
  recordMap: RecordMap,
  id: string,
): Collection | undefined => recordMap.collection?.[id]?.value;

export abstract class RecordClass {
  public abstract record: Block | Collection;
  public parent: {
    id: string;
    tableType: TableType;
    isWorkspace: boolean;
  } = { id: '', tableType: TABLE_TYPE.BLOCK, isWorkspace: false }; // meanless
  public canBeDir = true;

  public abstract getTitle(): string | undefined;
  public abstract getIcon(): string | undefined;
  protected setParent() {
    this.parent = {
      id: this.record.parent_id,
      tableType: this.record.parent_table as TableType,
      isWorkspace: this.record.parent_table === TABLE_TYPE.WORKSPACE,
    };
  }
}

class CollectionClass extends RecordClass {
  public record: Collection;
  constructor({ collection }: { collection: Collection }) {
    super();
    this.record = collection;
    this.setParent();
    this.canBeDir = CAN_BE_DIR.COLLECTION;
  }
  public getTitle() {
    return this.record.name?.map((array) => array[0]).join('');
  }
  public getIcon() {
    return this.record.icon;
  }
}

export class BlockClass extends RecordClass {
  public record: Block;
  constructor({ block }: { block: Block }) {
    super();
    this.record = block;
    this.setParent();

    if (!Object.hasOwn(CAN_BE_DIR.BLOCK, block.type)) {
      console.warn(`Unknown block type: ${block.type}`, {
        block,
      });
      this.canBeDir = false;
    } else {
      this.canBeDir = CAN_BE_DIR.BLOCK[block.type];
    }
    // this.canBeDir = ;
  }
  public getTitle() {
    // item.highlight.title は変な文字列交じることあるので使わない
    // ex) https://www.notion.so/c89a4d6f5d484b62be0e35c2f3ae2d99
    //   title: <gzkNfoUU>Grade</gzkNfoUU> Calculator dev.notion.so/notion/Academic-Mission-Control-f541b37eabc049429a7e37b74bf73594
    // block.properties?.title はキャッシュされるので、しばらく古い結果が出るけど。。。

    return this.record.properties?.title.map((array) => array[0]).join('');
  }
  public getIcon() {
    return this.record.format?.page_icon;
  }
}

// combines collection view page and collection view
class BlockCollectionViewClass extends BlockClass {
  collection?: CollectionClass;
  constructor({
    block,
    collection,
  }: {
    block: Block;
    collection?: CollectionClass;
  }) {
    super({ block });
    this.collection = collection;
  }
  public getTitle() {
    return super.getTitle() ?? this.collection?.getTitle();
  }
  public getIcon() {
    // collection が icon を持つケースは https://www.notion.so/4897c80a8baa4c4d92617e1f627121bf とか
    // cvp 全部がそうというわけでなく、 format.page_icon があるやつもある
    return super.getIcon() ?? this.collection?.getIcon();
  }
}

export const createRecord = (
  id: string,
  tableType: TableType,
  recordMap: RecordMap,
): RecordClass => {
  if (!Object.values(TABLE_TYPE).includes(tableType)) {
    throw new RecordError(`Unknown table type: ${tableType}`, {
      id,
      tableType,
      recordMap,
    });
  }
  if (tableType === TABLE_TYPE.WORKSPACE) {
    throw new RecordError(`Cannot handle a workspace`, {
      id,
      tableType,
      recordMap,
    });
  }

  // parent のみ
  if (tableType === TABLE_TYPE.COLLECTION) {
    const collection = getCollection(recordMap, id);
    if (!collection) {
      throw new RecordError(
        `Collection (id:${id}) is not found in recordMap.collection`,
        {
          id,
          tableType,
          recordMap,
        },
      );
    }
    return new CollectionClass({ collection });
  }

  const block = getBlock(recordMap, id);
  if (!block) {
    throw new RecordError(`Block (id:${id}) is not found in recordMap.block`, {
      id,
      tableType,
      recordMap,
    });
  }
  if (!Object.values(BLOCK_TYPE).includes(block.type)) {
    // コード側では、CVP かそれ以外か、で扱ってるので、処理は中断しない
    console.warn(`Unknown block type: ${block.type}`, {
      id,
      tableType,
      block,
      recordMap,
    });
  }

  if (
    block.type === BLOCK_TYPE.COLLECTION_VIEW_PAGE ||
    block.type === BLOCK_TYPE.COLLECTION_VIEW
  ) {
    let collection: Collection | undefined = undefined;
    if (block.collection_id) {
      collection = getCollection(recordMap, block.collection_id);
      if (!collection) {
        throw new RecordError(
          `block.collection_id exists, but collection_id:${block.collection_id} is not found in recordMap.collection`,
          {
            id,
            tableType,
            block,
            recordMap,
          },
        );
      }
    }
    return new BlockCollectionViewClass({
      block,
      ...(collection
        ? { collection: new CollectionClass({ collection }) }
        : {}),
    });
  }
  return new BlockClass({ block });
};

export const createBlock = (id: string, recordMap: RecordMap) => {
  const record = createRecord(id, TABLE_TYPE.BLOCK, recordMap);
  if (!(record instanceof BlockClass))
    throw new RecordError('Not a block', {
      id,
      record,
      recordMap,
    });

  return record as BlockClass;
};
