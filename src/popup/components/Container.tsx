import React, { useEffect, useState } from 'react';
import { activate, getSpaceFromCache } from '../../activation';
import SearchContainer from './SearchContainer';

const ACTIVATION_STATUS = {
  NOT_ACTIVATED: 'NOT_CHECKED',
  ABORTED: 'ABORTED',
  ACTIVATED: 'ACTIVATED',
} as const;

export default function Container() {
  const [spaceId, _setSpaceId] = useState<string>('');
  const [activationStatus, setActivationStatus] = useState<
    valueOf<typeof ACTIVATION_STATUS>
  >(ACTIVATION_STATUS.NOT_ACTIVATED);

  const setSpaceId = (spaceId: string) => {
    _setSpaceId(spaceId);
    setActivationStatus(ACTIVATION_STATUS.ACTIVATED);
  };

  const isPopup = location.search === '?popup';

  const activateAndSetStatus = async () => {
    const result = await activate();
    if (result.aborted) {
      setActivationStatus(ACTIVATION_STATUS.ABORTED);
      return;
    }
    setSpaceId(result.space.id);
  };

  useEffect(() => {
    (async () => {
      const space = await getSpaceFromCache();
      if (space) {
        setSpaceId(space.id);
        return;
      }
      activateAndSetStatus();
    })();
  }, []);

  switch (activationStatus) {
    case ACTIVATION_STATUS.NOT_ACTIVATED:
      return null;
    case ACTIVATION_STATUS.ABORTED:
      return (
        <main>
          <a href="#">
            <p
              onClick={(event) => {
                activateAndSetStatus();
                event.preventDefault();
              }}
            >
              Activate
            </p>
          </a>
        </main>
      );
    case ACTIVATION_STATUS.ACTIVATED:
      return <SearchContainer isPopup={isPopup} spaceId={spaceId} />;
  }
}
