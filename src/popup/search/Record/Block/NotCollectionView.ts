import { BLOCK_TYPE } from '../../../constants';
import { Block } from './';
import { isCollectionView } from './CollectionView';

export class BlockNotCollectionView extends Block {
  public type: BlockType;
  /*
    # クラス設計どうしよう会議
    - 全然別のバリデーションをしたいので、今のままだと駄目 ( constructor での super() が強制)
    - create みたいなメソッド生やす
      - プロパティの初期化できないので駄目ぽ

    - BlockCollectionView
    - BlockNotCollectionView
      - これかなぁ。。。
      - BlockBase みたいなの要るよね
  */
  constructor({ block }: { block: Response.Block }) {
    super({ block });
    this.type = block.type;

    if (isCollectionView(block)) {
      throw new Error(
        `Collection view. type: ${block.type}. block: ${JSON.stringify(block)}`,
      );
    } else if (!Object.values(BLOCK_TYPE).includes(block.type)) {
      throw new Error(
        `Unknown block type: ${block.type}. block: ${JSON.stringify(block)}`,
      );
    }
  }
  public canBeDir() {
    return this.type === BLOCK_TYPE.PAGE;
  }
}
