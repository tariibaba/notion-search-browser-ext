import { BlockClass } from './Block';
import { CollectionClass } from './Collection';

// combines collection view page and collection view
export class BlockCollectionViewClass extends BlockClass {
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
