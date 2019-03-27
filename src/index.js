/* eslint-disable import/extensions */
import gameBoard from './boardFunctions.js';
import player from './playerMoves.js';
import shipSpec from './shipSpec.js';
import {
  gridRenderer,
  fleetRenderer,
  movesRenderer,
  winnerModal,
  getUserShipPos,
  hidePlacementScreen,
  showError,
} from './domManipulations.js';

const main = () => {
  const players = [player('playerOne'), player('playerTwo')];
  const gameBoardsArr = [gameBoard(), gameBoard()];

  const createFleetSpec = () => [
    shipSpec(2),
    shipSpec(2),
    shipSpec(3),
    shipSpec(4),
    shipSpec(5),
  ];

  const initUserBoard = (customPos = []) => {
    const fleetSpec = createFleetSpec();
    const fleetPos = customPos;
    if (fleetPos.length === 0) {
      fleetPos.push({ coords: [0, 0], rotate: false });
      fleetPos.push({ coords: [6, 0], rotate: false });
      fleetPos.push({ coords: [0, 9], rotate: false });
      fleetPos.push({ coords: [0, 2], rotate: true });
      fleetPos.push({ coords: [4, 3], rotate: true });
    }
    for (let i = 0; i < fleetSpec.length; i += 1) {
      const success = gameBoardsArr[0].shipDeployer(
        fleetPos[i].coords,
        fleetSpec[i],
        fleetPos[i].rotate,
      );
      if (!success) {
        // reset fleet
        for (let j = 0; j < fleetSpec.length; j += 1) {
          gameBoardsArr[0].fleet.pop();
        }
        return false;
      }
    }
    return true;
  };

  const randomPlacement = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const sideWays = Math.floor(Math.random() * 2);
    if (sideWays === 0) {
      return { coords: [x, y], rotate: false };
    }
    return { coords: [x, y], rotate: true };
  };

  const initCompFleet = () => {
    const fleet = createFleetSpec();
    let shipPos;
    let placed;
    for (let i = 0; i < fleet.length; i += 1) {
      do {
        shipPos = randomPlacement();
        placed = gameBoardsArr[1].shipDeployer(
          shipPos.coords,
          fleet[i],
          shipPos.rotate,
        );
      } while (!placed);
    }
  };

  const gridCreator = context => {
    // eslint-disable-next-line no-undef
    const grid = document.createElement('div');
    grid.classList.add(context);
    grid.id = `${context}Board`;
    for (let i = 0; i < 100; i += 1) {
      // eslint-disable-next-line no-undef
      const square = document.createElement('div');
      square.classList.add('grid-item');
      square.id = `${context}-${i}`;
      if (context === 'shipSelect') {
        square.innerHTML = i;
      }
      grid.appendChild(square);
    }
    return grid;
  };

  const showShipPlacer = () => {
    // eslint-disable-next-line no-undef
    const shipPlacement = document.getElementById('shipPlacement');
    const grid = gridCreator('shipSelect');
    shipPlacement.appendChild(grid);
  };

  const isGameOver = () => {
    if (
      gameBoardsArr[0].destroyedFleet() ||
      gameBoardsArr[1].destroyedFleet()
    ) {
      return true;
    }
    return false;
  };

  const getWinnerName = () => {
    if (gameBoardsArr[0].destroyedFleet()) {
      return players[1].name;
    }
    if (gameBoardsArr[1].destroyedFleet()) {
      return players[0].name;
    }
    return false;
  };

  const getAttackCoords = event => {
    const attackSquare = parseInt(event.target.id.match(/[0-9]{1,}/), 10);
    const attackX = Math.floor(attackSquare / 10);
    const attackY = attackSquare % 10;
    return [attackX, attackY];
  };

  const attackListener = () => {
    // eslint-disable-next-line no-undef
    const compBoard = document.getElementById(`${players[1].name}Board`);
    compBoard.onclick = event => {
      const playerAttack = getAttackCoords(event);
      const validAttack = players[0].attack(playerAttack);
      if (validAttack && !isGameOver()) {
        gameBoardsArr[1].receiveHit(validAttack);
        movesRenderer(players[1].name, gameBoardsArr[1]);
        let compMove;
        do {
          compMove = players[1].randomMove();
        } while (!compMove);
        gameBoardsArr[0].receiveHit(compMove);
        movesRenderer(players[0].name, gameBoardsArr[0]);
        // eslint-disable-next-line no-unused-expressions
        isGameOver() && winnerModal(getWinnerName());
      }
      return true;
    };
  };

  const startGame = () => {
    // eslint-disable-next-line no-undef
    const beginBtn = document.getElementById('beginBtn');
    showShipPlacer();
    beginBtn.onclick = event => {
      event.preventDefault();
      const success = initUserBoard(getUserShipPos());
      if (success) {
        hidePlacementScreen();
        initCompFleet();
        gridRenderer(players);
        fleetRenderer(players[0].name, gameBoardsArr[0].fleet);
        attackListener();
      } else {
        showError();
      }
    };
  };

  return {
    startGame,
  };
};

export default main;
