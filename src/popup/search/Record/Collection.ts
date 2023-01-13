import { CAN_BE_DIR } from '../../constants';
import { Record } from '../Record';

export class Collection extends Record {
  public record: Response.Collection;
  constructor({ collection }: { collection: Response.Collection }) {
    super();
    this.record = collection;
    this.setParent();
    this.canBeDir = CAN_BE_DIR.COLLECTION;
  }
  public get title() {
    return this.record.name?.map((array) => array[0]).join('');
  }
  public get icon() {
    return this.record.icon;
  }
}
