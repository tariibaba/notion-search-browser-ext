// NOTE: このファイルに仕様のメモはしない。 するなら apiResponse.d.ts に

import { TABLE_TYPE } from './constants';

export abstract class Record {
  public abstract record: SearchApi.Record;
  public parent: {
    id: string;
    tableType: SearchApi.TableType;
    isWorkspace: boolean;
  } = {
    id: '',
    tableType: TABLE_TYPE.BLOCK,
    isWorkspace: false,
  }; // meanless

  public abstract canBeDir(): boolean;
  public abstract get title(): string | undefined;
  public abstract get icon(): string | undefined;
  protected setParent() {
    this.parent = {
      id: this.record.parent_id,
      tableType: this.record.parent_table as SearchApi.TableType,
      isWorkspace: this.record.parent_table === TABLE_TYPE.WORKSPACE,
    };
  }
}
