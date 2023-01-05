import { axios } from './axios';
import { answerToIndex, selectAndLinkWorkspace } from './workspaces';

describe('answerToIndex', () => {
  test.each([
    { input: '1', expected: 1 },
    { input: '01', expected: 1 },
    { input: '0', expected: 0 },
    { input: '', expected: NaN },
    { input: 'x', expected: NaN },
    { input: '１', expected: 1 },
    { input: '　１09  ', expected: 109 },
  ])("'$input' -> $expected", ({ input, expected }) => {
    expect(answerToIndex(input)).toBe(expected);
  });
});

describe('selectAndLinkWorkspace', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('no spaces', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: {} });
    await expect(selectAndLinkWorkspace()).rejects.toThrow(
      /^No spaces are found/,
    );

    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        'user-id': {
          space: {},
        },
      },
    });
    await expect(selectAndLinkWorkspace()).rejects.toThrow(
      /^No spaces are found/,
    );
  });
  test('1 space', async () => {
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
    await expect(selectAndLinkWorkspace()).resolves.toEqual({
      hasAborted: false,
      workspace: {
        id: 'space1-id',
        name: 'space1-name',
      },
    });
  });
  describe('2 spaces', () => {
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
    test.each([
      {
        name: 'select one',
        input: '2',
        expected: {
          hasAborted: false,
          workspace: {
            id: 'space2-id',
            name: 'space2-name',
          },
        },
      },
      {
        name: 'abort',
        input: null,
        expected: { hasAborted: true },
      },
    ])('$name', async ({ input, expected }) => {
      const spy = jest.spyOn(global, 'prompt').mockReturnValue(input);
      await expect(selectAndLinkWorkspace()).resolves.toEqual(expected);
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
