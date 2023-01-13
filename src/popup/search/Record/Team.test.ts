import { TABLE_TYPE } from '../../constants';
import { Team } from '../Record/Team';

const TEAM: Response.Team = {
  id: 'team-id',
  name: 'team-name',
  parent_id: 'parent-id',
  parent_table: TABLE_TYPE.BLOCK,
};

it('title', () => {
  expect(
    new Team({
      team: {
        ...TEAM,
      },
    }).title,
  ).toBe('team-name');
});

// not used
describe('icon', () => {
  test.each([
    {
      name: 'gets a icon',
      input: { icon: 'https://example.com/icon.png' },
      expected: 'https://example.com/icon.png',
    },
    {
      name: 'no icon',
      input: {},
      expected: undefined,
    },
  ])('$name', ({ input, expected }) => {
    expect(
      new Team({
        team: {
          ...TEAM,
          ...input,
        },
      }).icon,
    ).toBe(expected);
  });
});

test('canBeDir', () => {
  expect(
    new Team({
      team: TEAM,
    }).canBeDir,
  ).toBe(true);
});
