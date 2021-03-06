/* eslint-disable no-undef */
const gridCreator = (context, squareClass) => {
  // eslint-disable-next-line no-undef
  const grid = document.createElement('div');
  grid.classList.add(context);
  grid.id = `${context}Board`;
  for (let i = 0; i < 100; i += 1) {
    // eslint-disable-next-line no-undef
    const square = document.createElement('div');
    // eslint-disable-next-line no-unused-expressions
    squareClass
      ? square.classList.add('square')
      : square.classList.add('grid-item');
    square.id = `${context}-${i}`;
    // eslint-disable-next-line no-unused-expressions
    context === 'shipSelect' && (square.innerHTML = i);
    grid.appendChild(square);
  }
  return grid;
};

const gridRenderer = players => {
  const container = document.getElementById('container');
  container.style.justifyContent = 'center';
  players.forEach(player =>
    container.appendChild(gridCreator(player.name, true)),
  );
  return true;
};

// Display user fleet on grid
const fleetRenderer = (context, fleet) => {
  const board = document.getElementById(`${context}Board`);
  fleet.forEach(member => {
    for (let i = 0; i < member.shipSpec.length; i += 1) {
      let position;
      if (member.pos.rotate) {
        position = member.pos.x * 10 + member.pos.y + i;
      } else {
        position = member.pos.x * 10 + 10 * i + member.pos.y;
      }
      board.childNodes[position].classList.add('ship');
    }
  });
  return true;
};

// Display hits and misses on the computer grid
const movesRenderer = (context, gameBoard) => {
  const board = document.getElementById(`${context}Board`);
  gameBoard.hits.forEach(hit => {
    const hitPos = hit[0] * 10 + hit[1];
    board.childNodes[hitPos].classList.add('hit');
  });
  gameBoard.misses.forEach(miss => {
    const missPos = miss[0] * 10 + miss[1];
    board.childNodes[missPos].classList.add('miss');
  });
  return true;
};

const showShipPlacer = () => {
  const shipPlacement = document.getElementById('shipPlacement');
  const grid = gridCreator('shipSelect');
  shipPlacement.appendChild(grid);
};

const hidePlacementScreen = () => {
  const shipPlacement = document.getElementById('shipPlacement');
  shipPlacement.parentNode.removeChild(shipPlacement);
};

// Retreive user fleet coordinates and orientation from form
const getUserShipPos = () => {
  const rotations = document.querySelectorAll('.shipRotate');
  const shipsPosArr = Array.from(document.querySelectorAll('.cellNumber'));
  return shipsPosArr.reduce((acc, ele, i) => {
    const x = Math.floor(ele.value / 10);
    const y = Math.floor(ele.value % 10);
    const rotated = rotations[i].checked;
    return [...acc, { coords: [x, y], rotate: rotated }];
  }, []);
};

const winnerModal = result => {
  const container = document.getElementById('container');
  const modal = document.createElement('div');
  const modalMessage = document.createElement('p');
  const rematchForm = document.createElement('form');
  const rematchBtn = document.createElement('input');
  const formattedName = result.winner === 'playerOne' ? 'You' : 'Computer';
  modal.classList.add('winner');
  modalMessage.innerHTML = `${formattedName} won the game!<br>No of Moves: ${
    result.movecount
  }`;
  rematchBtn.id = 'rematchBtn';
  rematchBtn.type = 'submit';
  rematchBtn.value = 'Rematch';
  modal.appendChild(modalMessage);
  rematchForm.appendChild(rematchBtn);
  modal.appendChild(rematchForm);
  container.appendChild(modal);
};

const showError = () => {
  const shipPlacement = document.getElementById('shipPlacement');
  const prevMsg = document.getElementById('invalidPlacement');
  if (!prevMsg) {
    const errorMsg = document.createElement('p');
    errorMsg.id = 'invalidPlacement';
    errorMsg.innerHTML =
      'Invalid ship coordinates. Please use the reference grid and try again.';
    shipPlacement.appendChild(errorMsg);
  }
};

export {
  gridRenderer,
  gridCreator,
  fleetRenderer,
  movesRenderer,
  winnerModal,
  showShipPlacer,
  getUserShipPos,
  hidePlacementScreen,
  showError,
};
