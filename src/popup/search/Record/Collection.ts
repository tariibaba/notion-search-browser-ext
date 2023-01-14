import { Record } from '../Record';

export class Collection extends Record {
  public record: SearchApi.Collection;
  constructor({ collection }: { collection: SearchApi.Collection }) {
    super();
    this.record = collection;
    this.setParent();
  }
  public canBeDir() {
    return false;
  }
  public get title() {
    return this.record.name?.map((array) => array[0]).join('');
  }
  // collection_view のアイコンで使う（ことがある）
  public get icon() {
    return this.record.icon;
  }
}
