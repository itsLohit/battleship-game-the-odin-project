const Ship = (() => {
  // Creating A Ship
  const createShip = (shipLength) => {
    const length = shipLength;
    let hits = 0;
    let sunkStatus = false;

    // Getters

    function isSunk() {
      return sunkStatus;
    }
    function getLength() {
      return length;
    }
    function getHits() {
      return hits;
    }

    //Ship State Modifiers

    function hit() {
      hits += 1;
      if (hits === length) {
        sunkStatus = true;
      }
    }

    return {
      isSunk,
      getLength,
      getHits,
      hit,
    };
  };
  return createShip;
})();

module.exports = Ship;
