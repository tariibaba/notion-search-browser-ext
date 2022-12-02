import React, { useEffect, useState } from 'react';
import { activate, getActivationStatus } from '../../activation';
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
      const activationStatus = await getActivationStatus();
      if (activationStatus.hasActivated) {
        setSpaceId(activationStatus.space.id);
        return;
      }
      console.log('activate automatically');
      activateAndSetStatus();
    })();
  }, []);

  switch (activationStatus) {
    case ACTIVATION_STATUS.NOT_ACTIVATED:
      return null;
    case ACTIVATION_STATUS.ABORTED:
      return (
        <main style={{ width: '400px', height: '300px', padding: '20px' }}>
          <button
            onClick={(event) => {
              activateAndSetStatus();
              event.preventDefault();
            }}
          >
            Click here to connect Notion
          </button>
        </main>
      );
    case ACTIVATION_STATUS.ACTIVATED:
      return <SearchContainer isPopup={isPopup} spaceId={spaceId} />;
  }
}
