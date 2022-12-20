export const getBlock = (recordMap: RecordMap, id: string): Block | undefined =>
  recordMap.block[id]?.value;

export const getCollection = (
  recordMap: RecordMap,
  id: string,
): Collection | undefined => recordMap.collection?.[id]?.value;
