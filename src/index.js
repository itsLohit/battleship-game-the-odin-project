import './styles.css';

const gameController = require('./factories/gameController');
const render = require('./factories/render');

document.addEventListener('DOMContentLoaded', () => {
  gameController.startGame();
  render.restartGameRender();
  render.renderBoards(
    gameController.getUserBoard(),
    gameController.getComputerBoard()
  );
});
