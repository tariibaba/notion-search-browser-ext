import React from 'react';

export const KeyboardShortcuts = () => {
  return (
    <div className="container">
      <h2>Keyboard Shortcuts</h2>
      <p>
        The shortcut key to <span className="mark fw-bold">open the popup</span>{' '}
        is set to <span className="mark fw-bold">Ctrl+Shift+N</span> by default.
      </p>
      <p>
        <button
          className="btn btn-outline-secondary"
          onClick={(event) => {
            chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
            event.preventDefault();
          }}
        >
          Customize shortcut keys
        </button>
      </p>
    </div>
  );
};
