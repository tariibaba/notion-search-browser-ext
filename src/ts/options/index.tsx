import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../postcss/options.pcss';
import { About } from './components/About';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { LinkedStatus } from './components/LinkedStatus';

const Container = () => {
  return (
    <>
      <LinkedStatus />
      <KeyboardShortcuts />
      <br />
      <hr />
      <About />
    </>
  );
};

const reactRoot = document.querySelector('.react-root');
if (!reactRoot) throw new Error('.react-root is not found');
createRoot(reactRoot).render(<Container />);
