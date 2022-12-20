import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../postcss/popup.pcss';
import { Container } from './components/Container';

const reactRoot = document.querySelector('.react-root');
if (!reactRoot) throw new Error('.react-root is not found');
createRoot(reactRoot).render(<Container />);
