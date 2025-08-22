const player = require('../factories/player');
const gameBoard = require('../factories/gameboard');
const ship = require('../factories/ship');

const GameController = (() => {
  let user, computer;
  let currentPlayer;

  function startGame() {
    user = player('You', 'human');
    computer = player('Computer', 'computer');

    currentPlayer = user;

    const userCarrier = ship('carrier', 3);
    const userSubmarine = ship('submarine', 4);
    const computerCarrier = ship('carrier', 3);
    const computerSubmarine = ship('submarine', 4);

    computer.gameBoard.placeShip(computerCarrier, 3, 2, 'vertical');
    computer.gameBoard.placeShip(computerSubmarine, 3, 5, 'vertical');
  }

  function computerTurn() {
    computer.randomAttack(user.gameBoard);
  }

  function changeCurrentPlayer() {
    if (currentPlayer === user) {
      currentPlayer = computer;
    } else {
      currentPlayer = user;
    }
  }

  function playerAttack(row, col) {
    computer.gameBoard.receiveAttack(row, col);
  }

  function getUserBoard() {
    return user.gameBoard;
  }

  function getComputerBoard() {
    return computer.gameBoard;
  }

  function checkWinner() {
    if (computer.gameBoard.allShipsSunk()) {
      return 'user';
    }
    if (user.gameBoard.allShipsSunk()) {
      return 'computer';
    }
    return null;
  }

  function placeComputerShips() {
    computer.gameBoard.resetBoard();
    const shipsToPlace = [
      { name: 'carrier', length: 5 },
      { name: 'battleship', length: 4 },
      { name: 'cruiser', length: 3 },
      { name: 'submarine', length: 3 },
      { name: 'destroyer', length: 2 },
    ];
    const orientations = ['horizontal', 'vertical'];
    shipsToPlace.forEach((computerShip) => {
      let placed = false;

      while (!placed) {
        const randomOrientation =
          orientations[Math.floor(Math.random() * orientations.length)];
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const shipObj = ship(computerShip.name, computerShip.length);
        placed = computer.gameBoard.placeShip(
          shipObj,
          row,
          col,
          randomOrientation
        );
      }
    });
  }

  return {
    startGame,
    playerAttack,
    getComputerBoard,
    getUserBoard,
    changeCurrentPlayer,
    computerTurn,
    checkWinner,
    placeComputerShips,
  };
})();

module.exports = GameController;
