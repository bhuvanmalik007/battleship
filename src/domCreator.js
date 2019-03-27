/* eslint-disable no-undef */
const domNode = (node, attrs, children) =>
  `<${node} ${attrs}>${children}</${node}>`;

export const addChild = (node, content) => {
  // eslint-disable-next-line no-param-reassign
  node.innerHTML = content + node.innerHTML;
};

// Unit -> IO
export const header = (container = document.getElementById('header')) => {
  const run = () =>
    addChild(
      container,
      domNode('div', 'class="header"', domNode('h1', 'class=""', 'Battleship')),
    );
  return {
    run,
  };
};

// Unit -> IO
export const subHeader = (container = document.getElementById('subheader')) => {
  const run = () =>
    addChild(
      container,
      domNode(
        'div',
        'class="subheader"',
        domNode('h1', 'class=""', 'Classic Battleship Game Against Computer'),
      ),
    );
  return {
    run,
  };
};

const shipTypes = [
  'Ship 1 (length: 2)',
  'Ship 2 (length: 2)',
  'Ship 3 (length: 3)',
  'Ship 4 (length: 4)',
  'Ship 5 (length: 5)',
];

export const shipForm = (container = document.getElementById('shipForm')) => {
  const html =
    shipTypes.reduce(
      (acc, x) =>
        acc +
        domNode('legend', 'class="input-label"', x) +
        domNode(
          'input',
          'type="number" min="0" max="99" class="cellNumber" placeholder="Square Number"',
          '',
        ) +
        domNode(
          'div',
          'class="flex-row"',
          domNode(
            'label',
            'class="check-label"',
            'Place horizontally (the front will be on the left)',
          ) + domNode('input', 'type="checkbox" class="shipRotate"', ''),
        ),
      '<legend>Place all ships based on their <b>front portion</b> vertically</legend><br>',
    ) + domNode('button', 'id="beginBtn"', 'Place');

  const run = () => addChild(container, html);
  return {
    run,
  };
};

export default domNode;
