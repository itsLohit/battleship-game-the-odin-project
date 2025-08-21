const gameController = require('../factories/gameController');

const Render = (() => {
  function showEndGameMessage(winner) {
    let oldMessage = document.getElementById('game-end-message');
    if (oldMessage) {
      oldMessage.remove();
    }
    const messageDiv = document.createElement('div');
    messageDiv.id = 'game-end-message';
    messageDiv.className = 'game-end-message';

    if (winner === 'user') {
      messageDiv.textContent = 'You Win!';
    }
    if (winner === 'computer') {
      messageDiv.textContent = 'You Lose!';
    }
    document.body.appendChild(messageDiv);
    return;
  }

  function renderBoards(userBoard, computerBoard) {
    const userDiv = document.getElementById('user-board');
    const computerDiv = document.getElementById('computer-board');

    userDiv.innerHTML = '';
    computerDiv.innerHTML = '';

    const userGrid = document.createElement('div');
    userGrid.classList.add('grid');
    const userData = userBoard.getBoard();
    for (let row = 0; row < userData.length; row++) {
      for (let col = 0; col < userData[row].length; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (userData[row][col].ship) cell.classList.add('ship');
        if (userData[row][col].status === 'hit') cell.classList.add('hit');
        if (userData[row][col] === 'miss') cell.classList.add('miss');
        userGrid.appendChild(cell);
      }
    }
    userDiv.appendChild(userGrid);

    const computerGrid = document.createElement('div');
    computerGrid.classList.add('grid');
    const computerData = computerBoard.getBoard();
    for (let row = 0; row < computerData.length; row++) {
      for (let col = 0; col < computerData[row].length; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (computerData[row][col].status === 'hit') cell.classList.add('hit');
        if (computerData[row][col] === 'miss') cell.classList.add('miss');

        if (
          computerData[row][col] !== 'miss' &&
          (!computerData[row][col].status ||
            computerData[row][col].status !== 'hit')
        ) {
          cell.addEventListener('click', () => {
            if (gameController.checkWinner()) return;
            gameController.playerAttack(row, col);
            Render.renderBoards(
              gameController.getUserBoard(),
              gameController.getComputerBoard()
            );
            if (gameController.checkWinner()) {
              showEndGameMessage(gameController.checkWinner());
              return;
            }
            gameController.computerTurn();
            Render.renderBoards(
              gameController.getUserBoard(),
              gameController.getComputerBoard()
            );
            if (gameController.checkWinner()) {
              showEndGameMessage(gameController.checkWinner());
              return;
            }
          });
        }

        computerGrid.appendChild(cell);
      }
    }
    computerDiv.appendChild(computerGrid);
  }

  function restartGameRender() {
    let restartButton = document.getElementById('restartButton');
    if (!restartButton) {
      restartButton = document.createElement('button');
      restartButton.id = 'restartButton'; // Use id for future checks/removal
      restartButton.classList.add('restartButton');
      restartButton.textContent = 'Restart Game';
      document.body.appendChild(restartButton);

      restartButton.addEventListener('click', () => {
        // Remove end game message on restart
        let oldMessage = document.getElementById('game-end-message');
        if (oldMessage) oldMessage.remove();

        gameController.startGame();
        Render.renderBoards(
          gameController.getUserBoard(),
          gameController.getComputerBoard()
        );
      });
    }
  }

  return {
    renderBoards,
    showEndGameMessage,
    restartGameRender,
  };
})();

module.exports = Render;
