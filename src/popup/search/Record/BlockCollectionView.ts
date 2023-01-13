import { Block } from './Block';
import { Collection } from './Collection';

// combines collection view page and collection view
export class BlockCollectionView extends Block {
  collection?: Collection;
  constructor({
    block,
    collection,
  }: {
    block: Response.Block;
    collection?: Collection;
  }) {
    super({ block });
    this.collection = collection;
  }
  public get title() {
    return super.title ?? this.collection?.title;
  }
  public get icon() {
    // collection が icon を持つケースは https://www.notion.so/4897c80a8baa4c4d92617e1f627121bf とか
    // cvp 全部がそうというわけでなく、 format.page_icon があるやつもある
    return super.icon ?? this.collection?.icon;
  }
}
