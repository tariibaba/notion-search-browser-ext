import React, { useEffect, useState } from 'react';
import { STORAGE_KEY } from '../constants';
import { getSpaceId } from '../getSpaceId';
import ActivatedContainer from './ActivatedContainer';

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

  const activate = async () => {
    const id =
      (await chrome.storage.sync.get(STORAGE_KEY.SPACE_ID))[
        STORAGE_KEY.SPACE_ID
      ] || (await getSpaceId());
    if (id) {
      setSpaceId(id);
      return;
    }
    setActivationStatus(ACTIVATION_STATUS.ABORTED);
  };

  useEffect(() => {
    activate();
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
                activate();
                event.preventDefault();
              }}
            >
              Activate
            </p>
          </a>
        </main>
      );
    case ACTIVATION_STATUS.ACTIVATED:
      return <ActivatedContainer isPopup={isPopup} spaceId={spaceId} />;
  }
}
