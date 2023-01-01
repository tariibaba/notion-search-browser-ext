import React from 'react';

export const About = () => (
  <div className="container">
    <p>About Notion Search</p>
    <ul>
      <li>
        <a href="mailto:cside.story@gmail.com" target="_blank" rel="noreferrer">
          Contact
        </a>
      </li>
      <li>
        <a
          href="https://chrome.google.com/webstore/detail/notion-search/nelmlmaelgfcpjgknkidapfnoddpjfee/reviews"
          target="_blank"
          rel="noreferrer"
        >
          Rate This Extension
        </a>
      </li>
      <li>
        <a
          href="https://github.com/Cside/notion-search/"
          target="_blank"
          rel="noreferrer"
        >
          Source Code
        </a>{' '}
        (Patches welcome :D )
      </li>
    </ul>
  </div>
);
