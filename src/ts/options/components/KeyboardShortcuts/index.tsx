import React from 'react';

export const KeyboardShortcuts = () => {
  return (
    <>
      <h1>Keyboard Shortcuts</h1>
      <p>
        The shortcut key to <span className="highlight">open the popup</span> is
        set to <span className="highlight">Ctrl+Shift+N</span> by default.
      </p>
      <p>
        <a
          href="#"
          onClick={(event) => {
            chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
            event.preventDefault();
          }}
        >
          Customize shortcut key
        </a>
      </p>
    </>
  );
};
