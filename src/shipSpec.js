const ship = length => {
  const hitboxes = new Array(length).fill(false, 0);

  const hit = pos => {
    if (!hitboxes[pos]) {
      hitboxes[pos] = true;
      return true;
    }
    return false;
  };
  const isSunk = () => hitboxes.every(box => box);
  return {
    length,
    hit,
    isSunk,
  };
};

export default ship;
