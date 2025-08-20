const gameboard = require('../factories/gameboard');

const player = (playerName, playerType) => {
  const name = playerName;
  const board = gameboard.createGameBoard();
  const type = playerType;

  function attack(opponentGameBoard, row, col) {
    opponentGameBoard.receiveAttack(row, col);
  }

  function randomAttack(humanGameBoard) {
    const board = humanGameBoard.getBoard();
    const possibleAttackCells = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 'x') {
          possibleAttackCells.push([row, col]);
        }
      }
    }
    if (possibleAttackCells.length === 0) {
      return false;
    }
    const index = Math.floor(Math.random() * possibleAttackCells.length);
    const [row, col] = possibleAttackCells[index];
    humanGameBoard.receiveAttack(row, col);
  }

  return {
    name,
    type,
    gameBoard: board,
    attack,
    randomAttack,
  };
};
module.exports = player;
