const player = name => {
  const moves = [];

  const attack = coords => {
    // If user click on an already attacked grid cell
    if (moves.some(move => move[0] === coords[0] && move[1] === coords[1])) {
      return false;
    }
    if (coords[0] >= 0 && coords[0] <= 9 && coords[1] >= 0 && coords[1] <= 9) {
      moves.push(coords);
      return coords;
    }
    return false;
  };

  const randomMove = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return attack([x, y]);
  };

  return { name, attack, randomMove, moves };
};

export default player;
