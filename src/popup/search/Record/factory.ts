import { Record } from '.';
import { BLOCK_TYPE, TABLE_TYPE } from '../../constants';
import { Block } from './Block';
import { BlockCollectionView } from './BlockCollectionView';
import { Collection } from './Collection';
import { RecordError, RecordNotFoundError, RecordTypeError } from './errors';
import { Team } from './Team';

export const createRecord = (
  id: string,
  tableType: TableType,
  recordMap: Response.RecordMap,
): Record => {
  switch (tableType) {
    case TABLE_TYPE.WORKSPACE:
      throw new RecordTypeError(`Can't handle a workspace`, {
        id,
        tableType,
        recordMap,
      });

    // only parent
    case TABLE_TYPE.COLLECTION: {
      const collection = recordMap.collection?.[id]?.value;
      if (!collection) {
        throw new RecordNotFoundError(
          `Collection (id:${id}) is not found in recordMap.collection`,
          {
            id,
            tableType,
            recordMap,
          },
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
          {
            id,
            tableType,
            recordMap,
          },
        );
      }
      return new Team({ team });
    }
    case TABLE_TYPE.BLOCK: {
      const block = recordMap.block[id]?.value;
      if (!block) {
        throw new RecordNotFoundError(
          `Block (id:${id}) is not found in recordMap.block`,
          {
            id,
            tableType,
            recordMap,
          },
        );
      }
      if (!Object.values(BLOCK_TYPE).includes(block.type)) {
        // コード側では、CVP かそれ以外か、で扱ってるので、問題なく扱える可能性もある。
        // ので、処理は中断しない
        console.error(`Unknown block type: ${block.type}`, {
          id,
          tableType,
          block: JSON.stringify(block),
        });
        console.info({ block, recordMap });
      }

      switch (block.type) {
        case BLOCK_TYPE.COLLECTION_VIEW_PAGE:
        case BLOCK_TYPE.COLLECTION_VIEW: {
          let collection: Response.Collection | undefined = undefined;
          if (block.collection_id) {
            collection = recordMap.collection?.[block.collection_id]?.value;
            if (!collection) {
              throw new RecordNotFoundError(
                `block.collection_id exists, but collection_id: ${block.collection_id} is not found in recordMap.collection`,
                {
                  id,
                  tableType,
                  block,
                  recordMap,
                },
              );
            }
          }
          return new BlockCollectionView({
            block,
            ...(collection
              ? { collection: new Collection({ collection }) }
              : {}),
          });
        }
        default:
          return new Block({ block });
      }
    }
    default:
      throw new RecordTypeError(`Unknown table type: ${tableType}`, {
        id,
        tableType,
        recordMap,
      });
  }
};

export const createBlock = (id: string, recordMap: Response.RecordMap) => {
  const record = createRecord(id, TABLE_TYPE.BLOCK, recordMap);
  if (!(record instanceof Block))
    // 今の実装では起こり得ない。保険
    throw new RecordError('Not a block', {
      id,
      record,
      recordMap,
    });

  return record as Block;
};
