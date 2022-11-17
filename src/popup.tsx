import React from 'react';
import { createRoot } from 'react-dom/client';

import Container from './components/container';

const reactRoot = document.querySelector('.react-root');
if (!reactRoot) throw new Error('.react-root is not found');
createRoot(reactRoot).render(<Container />);
