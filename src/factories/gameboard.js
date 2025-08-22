const gameBoard = (() => {
  const createGameBoard = () => {
    // Board Creation
    const board = [
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ];

    const ships = [];

    function getBoard() {
      return board;
    }

    function placeShip(shipName, row, col, direction) {
      if (ships.includes(shipName)) {
        return false;
      }
      let length = shipName.getLength();
      if (direction === 'horizontal') {
        for (let i = 0; i < length; i++) {
          if (
            row < 0 ||
            row >= board.length ||
            col < 0 ||
            col + length > board.length ||
            board[row][col + i] != 'x'
          ) {
            return false;
          }
        }
        for (let i = 0; i < length; i++) {
          board[row][col + i] = {
            ship: shipName,
            status: 'intact',
          };
        }
        ships.push(shipName);
        return true;
      } else if (direction === 'vertical') {
        for (let i = 0; i < length; i++) {
          if (
            col < 0 ||
            col >= board.length ||
            row < 0 ||
            row + length > board.length ||
            board[row + i][col] != 'x'
          ) {
            return false;
          }
        }
        for (let i = 0; i < length; i++) {
          board[row + i][col] = {
            ship: shipName,
            status: 'intact',
          };
        }
        ships.push(shipName);
        return true;
      }
    }

    function receiveAttack(row, col) {
      if (row >= board.length || col >= board.length || row < 0 || col < 0) {
        return false;
      }
      let cell = board[row][col];
      if (cell.status === 'hit' || cell === 'miss') {
        return false;
      }
      if (cell === 'x') {
        board[row][col] = 'miss';
        return true;
      } else if (typeof cell === 'object' && cell.ship) {
        cell.ship.hit();
        board[row][col].status = 'hit';
        return true;
      }
    }

    function allShipsSunk() {
      if (ships.length === 0) {
        return false;
      }
      for (let i = 0; i < ships.length; i++) {
        if (ships[i].isSunk() === false) {
          return false;
        }
      }
      return true;
    }

    function getShipsArrayLength() {
      return ships.length;
    }

    function resetBoard() {
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          board[row][col] = 'x';
        }
      }
      for (let i = 0; i < ships.length; i++) {
        ships[i].resetHitsAndSunkStatus();
      }
      ships.length = 0;
    }

    return {
      getBoard,
      placeShip,
      receiveAttack,
      allShipsSunk,
      getShipsArrayLength,
      resetBoard,
    };
  };

  return {
    createGameBoard,
  };
})();

module.exports = gameBoard;
