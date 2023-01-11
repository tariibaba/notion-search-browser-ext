import React, { useEffect, useState } from 'react';
import { axios } from '../../../../axios';
import { NOTION_BASE_URL } from '../../../../constants';
import './styles.pcss';

// TODO: test
export const EmptySearchResultsCallout = ({
  workspace,
}: {
  workspace: Workspace;
}) => {
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // 見せられなくても致命的でないのでエラーハンドリングしない
      const res = (await axios.post<GetWorkspacesApiResponse>('./getSpaces'))
        .data;

      // TODO: userId 手に入れたら改修の必要あり
      let isFound = false;
      loop: for (const { space_view: spaceViewObj } of Object.values(res)) {
        for (const { value } of Object.values(spaceViewObj)) {
          if (value.space_id !== workspace.id) continue;
          // Notion の workspace に加入したら最初の private page 作成ページにリダイレクトされるので、
          // private_pages が空ということは恐らくありえない
          if (value.private_pages.length === 0) {
            console.warn(
              `space_view.id.value.private_pages are empty. workspace: ${workspace.id}`,
            );
            continue;
          }
          /* NOTE: サイドバーの一番上の private page 。
            KNOWN PROBLEM:
              公開されてるページだとサイドバーが表示されないし Cookie もセットされない。
              API のレスポンスには page id しか無く public か否か判定できない。
              まぁニッチな機能なので、public である場合は一旦スルー ... 。 */
          setPageId(value.private_pages[0]);
          isFound = true;
          break loop;
        }
      }
      if (!isFound)
        throw new Error(
          `No private pages are found. workspace: ${workspace.id}`,
        );
    })();
  }, []);

  if (pageId === null) return null;

  const helpsUrl = chrome.runtime.getURL(
    './helps/empty-search-results.html?' +
      new URLSearchParams({
        primary_workspace_name: workspace.name,
        primary_workspace_url: `${NOTION_BASE_URL}/${pageId.replaceAll(
          '-',
          '',
        )}`,
      }),
  );
  return (
    <div className="callout callout-info">
      ℹ️ Always empty search results?{' '}
      <a href={helpsUrl} target="_blank" rel="noreferrer">
        Try this.
      </a>
    </div>
  );
};
