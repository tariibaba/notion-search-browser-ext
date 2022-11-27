import { activate, deactivate, getSpaceFromCache } from './activation';

// ========================================
// Activation Status
// ========================================

const space = await getSpaceFromCache();
const activatedBlock = $('.activated-block');
const notActivatedBlock = $('.not-activated-block');

if (space) {
  activatedBlock.classList.remove('hide');
  $('.space-name').textContent = space.name;
} else {
  notActivatedBlock.classList.remove('hide');
}

$('.activate').addEventListener('click', async () => {
  const result = await activate();
  if (result.aborted) return;
  const space = result.space;
  $('.space-name').textContent = space.name;

  activatedBlock.classList.remove('hide');
  notActivatedBlock.classList.add('hide');
});

$('.deactivate').addEventListener('click', async () => {
  await deactivate();
  activatedBlock.classList.add('hide');
  notActivatedBlock.classList.remove('hide');
});

// ========================================
// Keyboard Shortcut
// ========================================
$('.customize-key').addEventListener('click', async (event) => {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  event.preventDefault();
});

// ========================================
// Utils
// ========================================

function $<T extends Element = HTMLElement>(selector: string) {
  const elem = document.querySelector<T>(selector);
  if (!elem) throw new Error(`element "${selector} is not found"`);
  return elem;
}
