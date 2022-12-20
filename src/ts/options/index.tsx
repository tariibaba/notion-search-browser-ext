import '../../postcss/options.pcss';
import { alertError } from '../utils';
import {
  getLinkedWorkspace,
  LinkWorkspaceResult,
  selectAndLinkWorkspace,
  unlinkWorkspace,
} from '../workspaces';

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
  let workspace: Workspace | undefined;
  try {
    workspace = await getLinkedWorkspace();
  } catch (error) {
    alertError('Failed to get workspaces. Please reload this page.', error);
    throw error;
  }
  const linkedBlock = $('.linked-block');
  const notLinkedBlock = $('.not-linked-block');

  if (workspace) {
    linkedBlock.show();
    for (const elem of $$('.workspace-name')) {
      elem.textContent = workspace.name;
    }
  } else {
    notLinkedBlock.show();
  }

  $('.link').addEventListener('click', async () => {
    let result: LinkWorkspaceResult;
    try {
      result = await selectAndLinkWorkspace();
    } catch (error) {
      // TODO: 国際化
      alertError(
        'Failed to connect Notion. Please redo the operation later.',
        error,
      );
      throw error;
    }
    if (result.aborted) return;

    for (const elem of $$('.workspace-name')) {
      elem.textContent = result.workspace.name;
    }

    linkedBlock.show();
    notLinkedBlock.hide();
  });

  $('.unlink').addEventListener('click', async () => {
    const ok = confirm('Disconnect from Notion?');
    if (!ok) return;

    try {
      await unlinkWorkspace();
    } catch (error) {
      // TODO: 国際化
      alertError(
        'Failed to disconnect Notion. Please redo the operation later.',
        error,
      );
      throw error;
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
