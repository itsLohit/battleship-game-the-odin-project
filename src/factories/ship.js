const Ship = (() => {
  // Creating A Ship
  const createShip = (shipName, shipLength) => {
    const name = shipName;
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

    function resetHitsAndSunkStatus() {
      hits = 0;
      sunkStatus = false;
    }

    return {
      isSunk,
      getLength,
      getHits,
      hit,
      resetHitsAndSunkStatus,
    };
  };
  return createShip;
})();

module.exports = Ship;
