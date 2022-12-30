chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'open-search-page': {
      const popup = chrome.runtime.getManifest().action?.default_popup;
      if (!popup)
        throw new Error('action.default_popup is not found in manifest.json');
      chrome.tabs.create({
        url: chrome.runtime.getURL(popup.replace(/\?.+$/, '')),
      });
      break;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
});
