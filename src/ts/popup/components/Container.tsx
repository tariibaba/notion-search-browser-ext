import React, { useEffect, useState } from 'react';
import { getLinkedSpace, linkSpace } from '../../linkedSpace';
import SearchContainer from './SearchContainer';

// 後から足したくなるかもなので、今のところは boolean にしない
const LINK_STATUS = {
  NOT_LINKED: 'NOT_CHECKED',
  LINKED: 'LINKED',
} as const;

export default function Container() {
  const [space, _setSpace] = useState<Space | undefined>(undefined);
  const [linkStatus, setLinkStatus] = useState<valueOf<typeof LINK_STATUS>>(
    LINK_STATUS.NOT_LINKED,
  );

  const setSpace = (space: Space) => {
    _setSpace(space);
    setLinkStatus(LINK_STATUS.LINKED);
  };

  const isPopup = location.search === '?popup';

  const linkAndSetStatus = async () => {
    // NOTE: axios 側で alert しなくなった場合、ここでユーザーにエラーを通知する必要あり
    const result = await linkSpace();
    if (result.aborted) {
      return;
    }
    setSpace(result.space);
  };

  useEffect(() => {
    (async () => {
      let space: Space | undefined;
      try {
        space = await getLinkedSpace();
      } catch (error) {
        // TODO: 国際化
        alert(
          'Failed to get connected space. Please reload this page.\n' + error,
        );
        return;
      }
      if (space) {
        setSpace(space);
        return;
      }
      console.log('link automatically');
      await linkAndSetStatus();
    })();
  }, []);

  switch (linkStatus) {
    case LINK_STATUS.NOT_LINKED:
      return (
        <main style={{ width: '400px', height: '300px', padding: '20px' }}>
          <button
            onClick={(event) => {
              linkAndSetStatus();
              event.preventDefault();
            }}
          >
            Click here to connect Notion
          </button>
        </main>
      );
    case LINK_STATUS.LINKED:
      if (!space) throw new Error('Status is linked, but space is undefined');

      return <SearchContainer isPopup={isPopup} space={space} />;
  }
}
