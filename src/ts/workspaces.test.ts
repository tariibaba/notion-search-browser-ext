import { axios } from './axios';
import { linkWorkspace } from './workspaces';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('linkWorkspace', () => {
  it('no spaces', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: {} });
    await expect(linkWorkspace()).rejects.toThrow(/^No spaces are found/);

    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        'user-id': {
          space: {},
        },
      },
    });
    await expect(linkWorkspace()).rejects.toThrow(/^No spaces are found/);
  });
  it('1 space', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        'user-id': {
          space: {
            'space1-id': {
              value: {
                name: 'space1-name',
              },
            },
          },
        },
      },
    });
    await expect(linkWorkspace()).resolves.toEqual({
      aborted: false,
      workspace: {
        id: 'space1-id',
        name: 'space1-name',
      },
    });
  });
  describe('2 space', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'post').mockResolvedValue({
        data: {
          'user-id': {
            space: {
              'space1-id': {
                value: {
                  name: 'space1-name',
                },
              },
              'space2-id': {
                value: {
                  name: 'space2-name',
                },
              },
            },
          },
        },
      });
    });
    it.each([
      {
        name: 'select one',
        input: '2',
        expected: {
          aborted: false,
          workspace: {
            id: 'space2-id',
            name: 'space2-name',
          },
        },
      },
      {
        name: 'abort',
        input: null,
        expected: { aborted: true },
      },
    ])('$name', async ({ input, expected }) => {
      const spy = jest.spyOn(global, 'prompt').mockReturnValue(input);
      await expect(linkWorkspace()).resolves.toEqual(expected);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(
        'Select your workspace by number:\n' +
          '    1. space1-name\n' +
          '    2. space2-name',
        '1',
      );
    });
  });
});
