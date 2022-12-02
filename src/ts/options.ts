import '../postcss/options.pcss';
import { activate, deactivate, getActivationStatus } from './activation';

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
// Activation Status
// ========================================

const activationStatus = await getActivationStatus();
const activatedBlock = $('.activated-block');
const notActivatedBlock = $('.not-activated-block');

let space: Space;

if (activationStatus.hasActivated) {
  activatedBlock.show();
  space = activationStatus.space;
  $('.space-name').textContent = space.name;
} else {
  notActivatedBlock.show();
}

$('.activate').addEventListener('click', async () => {
  const result = await activate();
  if (result.aborted) return;
  const space = result.space;
  $('.space-name').textContent = space.name;

  activatedBlock.show();
  notActivatedBlock.hide();
});

$('.deactivate').addEventListener('click', async () => {
  const ok = confirm('Disconnect from Notion?');
  if (!ok) return;

  await deactivate();
  activatedBlock.hide();
  notActivatedBlock.show();
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
