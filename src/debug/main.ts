import { BlockNotCollectionView } from '../popup/search/Record/Block/NotCollectionView';

const block = new BlockNotCollectionView({
  block: JSON.parse(prompt('json') || ''),
});

console.info({
  title: block.title,
  icon: block.icon,
});

const elem = document.getElementById('result');
if (elem) elem.innerText = JSON.stringify(block, null, 2);
