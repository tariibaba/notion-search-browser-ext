import { Record } from '.';
import { Block } from './Block';
import { BlockCollectionView, isCollectionView } from './Block/CollectionView';
import { BlockNotCollectionView } from './Block/NotCollectionView';
import { Collection } from './Collection';
import { TABLE_TYPE } from './constants';
import { RecordError, RecordNotFoundError, RecordTypeError } from './errors';
import { Team } from './Team';

// NOTE: ログ指針：
//  - id, tableType は上流で吐いてるのでここでは吐かない
//  - block は吐く
export const createRecord = (
  id: string,
  tableType: SearchApi.TableType,
  recordMap: SearchApi.RecordMap,
): Record => {
  switch (tableType) {
    case TABLE_TYPE.WORKSPACE:
      throw new RecordTypeError(`Can't handle a workspace`);

    // only parent
    case TABLE_TYPE.COLLECTION: {
      const collection = recordMap.collection?.[id]?.value;
      if (!collection) {
        throw new RecordNotFoundError(
          `Collection (id:${id}) is not found in recordMap.collection`,
        );
      }
      return new Collection({ collection });
    }
    // only parent
    case TABLE_TYPE.TEAM: {
      const team = recordMap.team?.[id]?.value;
      if (!team) {
        throw new RecordNotFoundError(
          `Team (id:${id}) is not found in recordMap.team`,
        );
      }
      return new Team({ team });
    }
    case TABLE_TYPE.BLOCK: {
      const block = recordMap.block[id]?.value;
      if (!block) {
        throw new RecordNotFoundError(
          `Block (id:${id}) is not found in recordMap.block`,
        );
      }

      if (isCollectionView(block)) {
        let collection: SearchApi.Collection | undefined = undefined;
        if (block.collection_id) {
          collection = recordMap.collection?.[block.collection_id]?.value;
          if (!collection) {
            throw new RecordNotFoundError(
              `block.collection_id exists, ` +
                `but collection_id: ${block.collection_id} is not found in recordMap.collection. ` +
                `block: ${JSON.stringify(block)}`,
            );
          }
        }
        return new BlockCollectionView({
          block,
          ...(collection ? { collection: new Collection({ collection }) } : {}),
        });
      }
      return new BlockNotCollectionView({ block });
    }
    default:
      throw new RecordTypeError(`Unknown table type: ${tableType}`);
  }
};

export const createBlock = (id: string, recordMap: SearchApi.RecordMap) => {
  const record = createRecord(id, TABLE_TYPE.BLOCK, recordMap);
  if (!(record instanceof Block))
    // 今の実装では起こり得ない。保険
    throw new RecordError(`Not a block: ${JSON.stringify(record)}`);

  return record as Block;
};
