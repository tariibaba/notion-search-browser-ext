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

(async () => {
  // ========================================
  // Link Status
  // ========================================
  let space: Space | undefined;
  try {
    space = await getLinkedSpace();
  } catch (error) {
    alert('Failed to get connected space. Please reload this page.\n' + error);
    return;
  }
  const linkedBlock = $('.linked-block');
  const notLinkedBlock = $('.not-linked-block');

  if (space) {
    linkedBlock.show();
    for (const elem of $$('.space-name')) {
      elem.textContent = space.name;
    }
  } else {
    notLinkedBlock.show();
  }

  $('.link').addEventListener('click', async () => {
    let result: { aborted: true } | { aborted: false; space: Space };
    try {
      result = await linkSpace();
    } catch (error) {
      // TODO: 国際化
      alert('Failed to connect space. Please redo the operation.\n' + error);
      return;
    }
    if (result.aborted) return;

    const space = result.space;
    for (const elem of $$('.space-name')) {
      elem.textContent = space.name;
    }

    linkedBlock.show();
    notLinkedBlock.hide();
  });

  $('.unlink').addEventListener('click', async () => {
    const ok = confirm('Disconnect from Notion?');
    if (!ok) return;

    try {
      await unlinkSpace();
    } catch (error) {
      // TODO: 国際化
      alert('Failed to disconnect space. Please redo the operation.\n' + error);
      return;
    }
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
})();

// ========================================
// Utils
// ========================================

function $<T extends Element = HTMLElement>(selector: string) {
  const elem = document.querySelector<T>(selector);
  if (!elem) throw new Error(`element "${selector} is not found"`);
  return elem;
}

function $$<T extends Element = HTMLElement>(selector: string) {
  return document.querySelectorAll<T>(selector);
}
