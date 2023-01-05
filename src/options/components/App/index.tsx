import React from 'react';
import '../../../common.css';
import { About } from '../About';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { LinkedStatus } from '../LinkedStatus';

export const App = () => (
  <div className="container">
    <h1 className="py-2">Options</h1>
    <table className="table">
      <tbody>
        <LinkedStatus />
        <KeyboardShortcuts />
      </tbody>
    </table>
    <hr className="mt-5" />
    <About />
  </div>
);
