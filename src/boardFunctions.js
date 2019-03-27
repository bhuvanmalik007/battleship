const gameBoard = () => {
  const fleet = [];
  const hits = [];
  const misses = [];

  // Determines collision of a coordinate with a ship
  const shipDetector = coords => {
    for (let index = 0; index < fleet.length; index += 1) {
      const member = fleet[index];
      for (let i = 0; i < member.shipSpec.length; i += 1) {
        if (
          member.pos.rotate &&
          coords[0] === member.pos.x &&
          coords[1] === member.pos.y + i
        ) {
          return [index, i];
        }
        if (
          !member.pos.rotate &&
          coords[0] === member.pos.x + i &&
          coords[1] === member.pos.y
        ) {
          return [index, i];
        }
      }
    }
    return false;
  };

  // Validates input coordinates and checks for collision between user fleet
  const shipDeployer = (chosenCoords, shipSpec, rotate = false) => {
    if (
      chosenCoords[0] < 0 ||
      chosenCoords[0] > 9 ||
      chosenCoords[1] < 0 ||
      chosenCoords[1] > 9
    ) {
      return false;
    }
    if (
      (!rotate && chosenCoords[0] + shipSpec.length - 1 > 9) ||
      (rotate && chosenCoords[1] + shipSpec.length - 1 > 9)
    ) {
      return false;
    }
    const shipCoords = [];
    const collisions = [];
    for (let i = 0; i < shipSpec.length; i += 1) {
      if (rotate) {
        shipCoords.push([chosenCoords[0], chosenCoords[1] + i]);
      } else {
        shipCoords.push([chosenCoords[0] + i, chosenCoords[1]]);
      }
      collisions.push(shipDetector(shipCoords[i]));
    }
    const noCollisions = collisions.every(match => match === false);
    if (noCollisions) {
      const newShip = {};
      newShip.pos = {
        x: chosenCoords[0],
        y: chosenCoords[1],
        rotate,
      };
      newShip.shipSpec = shipSpec;
      fleet.push(newShip);
      return true;
    }
    return false;
  };

  // Detects and updates hits & misses
  const receiveHit = coords => {
    const hit = shipDetector(coords);
    if (!hit) {
      misses.push(coords);
    } else {
      const shipId = hit[0];
      const hitBox = hit[1];
      fleet[shipId].shipSpec.hit(hitBox);
      hits.push(coords);
    }
    return true;
  };

  // Check if an entire fleet has been destroyed to conclude the game
  const destroyedFleet = () => fleet.every(member => member.shipSpec.isSunk());

  return {
    fleet,
    hits,
    misses,
    shipDeployer,
    receiveHit,
    destroyedFleet,
  };
};

export default gameBoard;
