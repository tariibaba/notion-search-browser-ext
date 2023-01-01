// NOTE: このファイルに仕様のメモはしない。 するなら apiResponse.d.ts に

import { TABLE_TYPE } from '../../constants';

export abstract class Record {
  public abstract record: Response.Block | Response.Collection;
  public parent: {
    id: string;
    tableType: TableType;
    isWorkspace: boolean;
  } = {
    id: '',
    tableType: TABLE_TYPE.BLOCK,
    isWorkspace: false,
  }; // meanless
  public canBeDir = true;

  public abstract getTitle(): string | undefined;
  public abstract getIcon(): string | undefined;
  protected setParent() {
    this.parent = {
      id: this.record.parent_id,
      tableType: this.record.parent_table as TableType,
      isWorkspace: this.record.parent_table === TABLE_TYPE.WORKSPACE,
    };
  }
}
