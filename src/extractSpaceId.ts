import { MESSAGE_TYPE } from './popup/constants';

const img = document.querySelector<HTMLImageElement>(
  '.notion-sidebar-switcher img',
);
if (!img) {
  const message = 'Profile image ".notion-sidebar-switcher img" is not found';
  alert(message);
  throw new Error(message);
}

const matched = img.src.match(/.+(https.+)/);
if (!matched) {
  const message = 'url is not found in img.src';
  alert(message);
  throw new Error(message);
}
const decoded = decodeURIComponent(matched[1]);
let url: URL;
try {
  url = new URL(decoded);
} catch (error) {
  const message = `Invalid URL: ${decoded}`;
  alert(message);
  throw new Error(message);
}
const spaceId = url.searchParams.get('id');

chrome.runtime.sendMessage(
  { type: MESSAGE_TYPE.ADD_SPACE_ID, data: { spaceId } },
  () => {
    alert(`Notion Space ID added. You can enjoy search within popup.`);
  },
);
