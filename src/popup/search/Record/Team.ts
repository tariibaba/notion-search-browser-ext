import { Record } from '../Record';

export class Team extends Record {
  public record: Response.Team;
  constructor({ team }: { team: Response.Team }) {
    super();
    this.record = team;
    this.setParent();
  }
  public canBeDir() {
    return true;
  }
  public get title() {
    return this.record.name;
  }
  // not used
  public get icon() {
    return this.record.icon;
  }
}
