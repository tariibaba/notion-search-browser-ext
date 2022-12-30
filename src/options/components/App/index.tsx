import React from 'react';
import '../../../common.css';
import { About } from '../About';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { LinkedStatus } from '../LinkedStatus';

export const App = () => (
  <div className="container">
    <h1>Options</h1>
    <LinkedStatus />
    <KeyboardShortcuts />
    <br />
    <hr />
    <About />
  </div>
);
