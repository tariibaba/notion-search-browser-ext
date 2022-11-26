import { MESSAGE_TYPE, STORAGE_KEY } from './popup/constants';

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'open-search-page':
      chrome.tabs.create({ url: chrome.runtime.getURL('search.html') });
      break;
    default:
      throw new Error(`unknown command: ${command}`);
  }
});

chrome.runtime.onMessage.addListener(async (req, _, sendRes) => {
  switch (req.type) {
    case MESSAGE_TYPE.ADD_SPACE_ID:
      await chrome.storage.sync.set({
        [STORAGE_KEY.SPACE_ID]: req.data.spaceId,
      });
      break;
    default:
      throw new Error(`unknown type: ${req.type}`);
  }
  // TODO: 非同期で実行できないので失敗するはず
  sendRes({ status: 'OK' });
});
