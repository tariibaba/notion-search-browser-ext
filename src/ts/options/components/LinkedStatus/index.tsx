import React, { useEffect } from 'react';
import { useWorkspace } from '../../../hooks';
import { alertError } from '../../../utils';

export const LinkedStatus = () => {
  const {
    workspace,
    hasGotWorkspace,
    error,
    selectAndLinkWorkspace,
    unlinkWorkspace,
  } = useWorkspace();

  useEffect(() => {
    if (error) {
      alertError(error.message, error.error);
      throw error.error;
    }
  }, [error]);

  return (
    <>
      <h1>Connection Status</h1>
      {hasGotWorkspace &&
        (workspace ? (
          <div className="linked-block">
            <p className="status">✅ Connected to Notion</p>
            <p>
              Your workspace:{' '}
              <span className="highlight">{workspace.name}</span>
            </p>
            <p>
              <button
                className="unlink"
                onClick={() => {
                  const ok = confirm('Disconnect from Notion?');
                  if (!ok) return;
                  unlinkWorkspace();
                }}
              >
                Disconnect from {workspace.name}
              </button>
            </p>
          </div>
        ) : (
          <div className="not-linked-block">
            <p className="status">❌ Not Connected to Notion</p>
            <p>
              <button className="link" onClick={selectAndLinkWorkspace}>
                Connect to Notion
              </button>
            </p>
          </div>
        ))}
    </>
  );
};
