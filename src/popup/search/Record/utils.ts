import { BLOCK_TYPE } from '../../constants';

export const isCollectionView = (
  block: SearchApi.Block,
): block is SearchApi.BlockCollectionView => {
  return (
    [
      BLOCK_TYPE.COLLECTION_VIEW,
      BLOCK_TYPE.COLLECTION_VIEW_PAGE,
    ] as SearchApi.BlockType[]
  ).includes(block.type);
};
