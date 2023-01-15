import { Record } from '../../Record';

export abstract class Block extends Record {
  public record: SearchApi.Block;

  constructor({ block }: { block: SearchApi.Block }) {
    super();
    this.record = block;
    this.setParent();
  }
  public get title() {
    // item.highlight.title は変な文字列交じることあるので使わない
    // ex) https://www.notion.so/c89a4d6f5d484b62be0e35c2f3ae2d99
    //   title: <gzkNfoUU>Grade</gzkNfoUU> Calculator dev.notion.so/notion/Academic-Mission-Control-f541b37eabc049429a7e37b74bf73594
    // block.properties?.title はキャッシュされるので、しばらく古い結果が出るけど。。。

    // ['Works'], ['pace'] のように単語がぶった切られてることがあるので、'' で join で OK 。
    // ex) https://www.notion.so/9b5ff64a69a24b298c6c9d9df65c26a4
    return this.record.properties?.title?.map((array) => array[0]).join('');
  }
  public get icon() {
    return this.record.format?.page_icon;
  }
}
