chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'open-search-page':
      chrome.tabs.create({ url: chrome.runtime.getURL('search.html') });
      break;
    default:
      throw new Error(`unknown command: ${command}`);
  }
});
