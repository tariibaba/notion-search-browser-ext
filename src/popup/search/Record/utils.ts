export const getBlock = (
  recordMap: Response.RecordMap,
  id: string,
): Response.Block | undefined => recordMap.block[id]?.value;

export const getCollection = (
  recordMap: Response.RecordMap,
  id: string,
): Response.Collection | undefined => recordMap.collection?.[id]?.value;
