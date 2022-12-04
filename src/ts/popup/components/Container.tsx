import React, { useEffect, useState } from 'react';
import { activate, getActivationStatus } from '../../activation';
import SearchContainer from './SearchContainer';

const ACTIVATION_STATUS = {
  NOT_ACTIVATED: 'NOT_CHECKED',
  ABORTED: 'ABORTED',
  ACTIVATED: 'ACTIVATED',
} as const;

export default function Container() {
  const [space, _setSpace] = useState<Space | null>(null);
  const [activationStatus, setActivationStatus] = useState<
    valueOf<typeof ACTIVATION_STATUS>
  >(ACTIVATION_STATUS.NOT_ACTIVATED);

  const setSpace = (space: Space) => {
    _setSpace(space);
    setActivationStatus(ACTIVATION_STATUS.ACTIVATED);
  };

  const isPopup = location.search === '?popup';

  const activateAndSetStatus = async () => {
    const result = await activate();
    if (result.aborted) {
      setActivationStatus(ACTIVATION_STATUS.ABORTED);
      return;
    }
    setSpace(result.space);
  };

  useEffect(() => {
    (async () => {
      const activationStatus = await getActivationStatus();
      if (activationStatus.hasActivated) {
        setSpace(activationStatus.space);
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
      if (space === null)
        throw new Error('Status is activated, but space is null');

      return <SearchContainer isPopup={isPopup} space={space} />;
  }
}
