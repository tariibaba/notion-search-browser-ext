import React, { useEffect, useState } from 'react';
import { getLinkedSpace, linkSpace } from '../../linkedSpace';
import SearchContainer from './SearchContainer';

const LINK_STATUS = {
  NOT_LINKED: 'NOT_CHECKED',
  ABORTED: 'ABORTED',
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
    const result = await linkSpace();
    if (result.aborted) {
      setLinkStatus(LINK_STATUS.ABORTED);
      return;
    }
    setSpace(result.space);
  };

  useEffect(() => {
    (async () => {
      const space = await getLinkedSpace();
      if (space) {
        setSpace(space);
        return;
      }
      console.log('link automatically');
      linkAndSetStatus();
    })();
  }, []);

  switch (linkStatus) {
    case LINK_STATUS.NOT_LINKED:
      return null;
    case LINK_STATUS.ABORTED:
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
