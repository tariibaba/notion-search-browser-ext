import '../postcss/options.pcss';
import { getLinkedSpace, linkSpace, unlinkSpace } from './linkedSpace';

declare global {
  interface HTMLElement {
    show(): void;
    hide(): void;
  }
}
HTMLElement.prototype.show = function () {
  this.classList.remove('hide');
};
HTMLElement.prototype.hide = function () {
  this.classList.add('hide');
};

// ========================================
// Link Status
// ========================================

const space = await getLinkedSpace();
const linkedBlock = $('.linked-block');
const notLinkedBlock = $('.not-linked-block');

if (space) {
  linkedBlock.show();
  $('.space-name').textContent = space.name;
} else {
  notLinkedBlock.show();
}

$('.link').addEventListener('click', async () => {
  const result = await linkSpace();
  if (result.aborted) return;
  const space = result.space;
  $('.space-name').textContent = space.name;

  linkedBlock.show();
  notLinkedBlock.hide();
});

$('.unlink').addEventListener('click', async () => {
  const ok = confirm('Disconnect from Notion?');
  if (!ok) return;

  await unlinkSpace();
  linkedBlock.hide();
  notLinkedBlock.show();
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
