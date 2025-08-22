import './styles.css';

const gameController = require('./factories/gameController');
const render = require('./factories/render');

document.addEventListener('DOMContentLoaded', () => {
  render.updateBanner('Drag or tap a ship to place');
  gameController.startGame();
  render.renderShipTray();
  render.restartGameRender();
  render.renderBoards(
    gameController.getUserBoard(),
    gameController.getComputerBoard()
  );
});
