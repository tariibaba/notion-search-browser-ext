import { act, cleanup, renderHook } from '@testing-library/react';
import { useWorkspace } from './hooks';
import * as workspaces from './workspaces';

describe('useWorkspace', () => {
  const dummyWorkspace1 = { id: 'space1-id', name: 'space1-name' };
  const dummyWorkspace2 = { id: 'space2-id', name: 'space2-name' };

  afterEach(() => cleanup());

  describe('getLinkedWorkspace', () => {
    describe('resolves', () => {
      test.each([
        {
          name: 'returns object',
          input: dummyWorkspace1,
          expected: {
            workspace: dummyWorkspace1,
            error: undefined,
            // renderHook し終わった時点で hasGotWorkspace = true なので
            // (act()で囲まなくても)、false の検証はできない。。
            hasGotWorkspace: true,
          },
        },
        {
          name: 'returns undefined',
          input: undefined,
          expected: {
            workspace: undefined,
            error: undefined,
            hasGotWorkspace: true,
          },
        },
      ])('$name', async ({ input, expected }) => {
        jest.spyOn(workspaces, 'getLinkedWorkspace').mockResolvedValue(input);

        const {
          result: { current },
        } = await act(async () => renderHook(() => useWorkspace()));

        expect(current).toEqual(expect.objectContaining(expected));
      });
    });
    test('rejects', async () => {
      jest
        .spyOn(workspaces, 'getLinkedWorkspace')
        .mockRejectedValue(new Error('a kind of error'));

      const {
        result: { current },
      } = await act(async () => renderHook(() => useWorkspace()));

      expect(current).toEqual(
        expect.objectContaining({
          workspace: undefined,
          hasGotWorkspace: true,
          error: expect.any(Error),
        }),
      );
      const error = current.error;
      expect(error?.message).toBe(
        'Failed to get workspaces. Please reload this page.',
      );
      const cause = error?.cause;
      expect((cause as Error).message).toBe('a kind of error');
    });
  });

  describe('selectAndLinkWorkspace', () => {
    test.each([
      {
        name: 'returns object',
        input: { hasAborted: false, workspace: dummyWorkspace2 },
        expected: {
          workspace: dummyWorkspace2,
          error: undefined,
        },
      },
      {
        name: 'hasAborted',
        input: { hasAborted: true },
        expected: {
          workspace: undefined,
          error: undefined,
        },
      },
    ])('$name', async ({ input, expected }) => {
      jest.spyOn(workspaces, 'getLinkedWorkspace').mockResolvedValue(undefined);
      jest
        .spyOn(workspaces, 'selectAndLinkWorkspace')
        .mockResolvedValue(input as workspaces.LinkWorkspaceResult);

      const { result } = await act(async () =>
        renderHook(() => useWorkspace()),
      );

      await act(async () => result.current.selectAndLinkWorkspace());

      expect(result.current).toEqual(expect.objectContaining(expected));
    });
  });

  describe('unlinkWorkspace', () => {
    beforeEach(() => {
      jest
        .spyOn(workspaces, 'getLinkedWorkspace')
        .mockResolvedValue(dummyWorkspace1);
    });
    test('resolves', async () => {
      const { result } = await act(async () =>
        renderHook(() => useWorkspace()),
      );

      expect(result.current).toEqual(
        expect.objectContaining({
          workspace: dummyWorkspace1,
          error: undefined,
        }),
      );

      await act(async () => result.current.unlinkWorkspace());

      expect(result.current).toEqual(
        expect.objectContaining({
          workspace: undefined,
          error: undefined,
        }),
      );
    });

    test('rejects', async () => {
      jest
        .spyOn(workspaces, 'unlinkWorkspace')
        .mockRejectedValue(new Error('a kind of error'));

      const { result } = await act(async () =>
        renderHook(() => useWorkspace()),
      );

      await act(async () => result.current.unlinkWorkspace());

      expect(result.current).toEqual(
        expect.objectContaining({
          error: expect.any(Error),
        }),
      );
      const error = result.current.error;
      expect(error?.message).toBe(
        'Failed to disconnect Notion. Please redo the operation later.',
      );
      const cause = error?.cause;
      expect((cause as Error).message).toBe('a kind of error');
    });
  });
});
