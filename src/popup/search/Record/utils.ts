import { BLOCK_TYPE } from '../../constants';

export const isCollectionView = (
  block: Response.Block,
): block is Response.BlockCollectionView => {
  return (
    [BLOCK_TYPE.COLLECTION_VIEW, BLOCK_TYPE.COLLECTION_VIEW_PAGE] as BlockType[]
  ).includes(block.type);
};
