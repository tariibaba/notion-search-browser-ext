import React from 'react';
import '../../../../postcss/options.pcss';
import { About } from '../About';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { LinkedStatus } from '../LinkedStatus';

export const App = () => (
  <>
    <LinkedStatus />
    <KeyboardShortcuts />
    <br />
    <hr />
    <About />
  </>
);
