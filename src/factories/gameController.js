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

    user.gameBoard.placeShip(userCarrier, 0, 2, 'horizontal');
    user.gameBoard.placeShip(userSubmarine, 1, 2, 'horizontal');
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

  return {
    startGame,
    playerAttack,
    getComputerBoard,
    getUserBoard,
    changeCurrentPlayer,
    computerTurn,
    checkWinner,
  };
})();

module.exports = GameController;
