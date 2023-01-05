import { CAN_BE_DIR } from '../../constants';
import { Record } from '../Record';

export class Block extends Record {
  public record: Response.Block;
  constructor({ block }: { block: Response.Block }) {
    super();
    this.record = block;
    this.setParent();

    // 未知でも、とりあえず通す
    if (!Object.hasOwn(CAN_BE_DIR.BLOCK, block.type)) {
      console.error(`Unknown block type: ${block.type}`, {
        block: JSON.stringify(block),
      });
      console.info({ block });
      this.canBeDir = false;
    } else {
      this.canBeDir = CAN_BE_DIR.BLOCK[block.type];
    }
  }
  public getTitle() {
    // item.highlight.title は変な文字列交じることあるので使わない
    // ex) https://www.notion.so/c89a4d6f5d484b62be0e35c2f3ae2d99
    //   title: <gzkNfoUU>Grade</gzkNfoUU> Calculator dev.notion.so/notion/Academic-Mission-Control-f541b37eabc049429a7e37b74bf73594
    // block.properties?.title はキャッシュされるので、しばらく古い結果が出るけど。。。
    return this.record.properties?.title.map((array) => array[0]).join('');
  }
  public getIcon() {
    return this.record.format?.page_icon;
  }
}
