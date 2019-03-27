/* eslint-disable import/extensions */
import gameBoard from './boardFunctions.js';
import player from './playerMoves.js';
import shipSpec from './shipSpec.js';
import {
  gridRenderer,
  gridCreator,
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
    for (let i = 0; i < fleetSpec.length; i += 1) {
      // Attach the coordinates
      const success = gameBoardsArr[0].shipDeployer(
        fleetPos[i].coords,
        fleetSpec[i],
        fleetPos[i].rotate,
      );
      if (!success) {
        // pop fleet
        for (let j = 0; j < fleetSpec.length; j += 1) {
          gameBoardsArr[0].fleet.pop();
        }
        return false;
      }
    }
    return true;
  };

  const randomShipPlacement = () => {
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
        shipPos = randomShipPlacement();
        placed = gameBoardsArr[1].shipDeployer(
          shipPos.coords,
          fleet[i],
          shipPos.rotate,
        );
      } while (!placed);
    }
  };

  const showReferenceGrid = () => {
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
      // console.log(players[0].moves.length);
      return { winner: players[0].name, movecount: players[0].moves.length };
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

  // Entry point
  const startGame = () => {
    // eslint-disable-next-line no-undef
    const beginBtn = document.getElementById('beginBtn');
    showReferenceGrid();
    beginBtn.onclick = event => {
      event.preventDefault();
      // Check if the coordinates are correct and there are no collisions amongst the user's fleet
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
