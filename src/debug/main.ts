import { Block } from '../popup/search/Record/Block';

const block = new Block({
  block: JSON.parse(prompt('json') || ''),
});

console.info({
  title: block.getTitle(),
  icon: block.getIcon(),
});

const elem = document.getElementById('result');
if (elem) elem.innerText = JSON.stringify(block, null, 2);
