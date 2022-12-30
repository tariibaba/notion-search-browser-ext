import { CAN_BE_DIR } from '../../constants';
import { RecordClass } from '../Record';

export class CollectionClass extends RecordClass {
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
