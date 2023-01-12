import { CAN_BE_DIR } from '../../constants';
import { Record } from '../Record';

export class Team extends Record {
  public record: Response.Team;
  constructor({ team }: { team: Response.Team }) {
    super();
    this.record = team;
    this.setParent();
    this.canBeDir = CAN_BE_DIR.TEAM;
  }
  public getTitle() {
    return this.record.name;
  }
  // not used
  public getIcon() {
    return this.record.icon;
  }
}
