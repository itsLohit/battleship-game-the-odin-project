const gameController = require('../factories/gameController');
const ship = require('../factories/ship');

const Render = (() => {
  let placingShips = true;
  let currentOrientation = 'horizontal';
  const orientationBtn = document.getElementById('orientation-toggle');

  let selectedShipName = null;
  let selectedShipLength = null;

  orientationBtn.addEventListener('click', () => {
    currentOrientation =
      currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    orientationBtn.textContent =
      currentOrientation.charAt(0).toUpperCase() + currentOrientation.slice(1);
  });

  document.querySelectorAll('.ship-draggable').forEach((ship) => {
    ship.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('ship-name', ship.dataset.name);
      e.dataTransfer.setData('ship-length', ship.dataset.length);
    });
  });

  function renderShipTray() {
    const tray = document.getElementById('ship-tray');
    tray.innerHTML = `
      <div class="ship-draggable" draggable="true" data-name="carrier" data-length="5">Carrier (5)</div>
      <div class="ship-draggable" draggable="true" data-name="battleship" data-length="4">Battleship (4)</div>
      <div class="ship-draggable" draggable="true" data-name="cruiser" data-length="3">Cruiser (3)</div>
      <div class="ship-draggable" draggable="true" data-name="submarine" data-length="3">Submarine (3)</div>
      <div class="ship-draggable" draggable="true" data-name="destroyer" data-length="2">Destroyer (2)</div>
    `;

    document.querySelectorAll('.ship-draggable').forEach((ship) => {
      ship.addEventListener('dragstart', (e) => {
        selectedShipName = ship.dataset.name;
        selectedShipLength = +ship.dataset.length;
        e.dataTransfer.setData('ship-name', selectedShipName);
        e.dataTransfer.setData('ship-length', selectedShipLength);
        updateBanner('Drag over a cell to place the ' + selectedShipName);
      });

      ship.addEventListener('click', () => {
        selectedShipName = ship.dataset.name;
        selectedShipLength = +ship.dataset.length;
        document
          .querySelectorAll('.ship-draggable')
          .forEach((s) => s.classList.remove('selected'));
        ship.classList.add('selected');
        updateBanner('Tap a position to place the ' + selectedShipName);
      });
    });

    tray.style.display = '';
    document.getElementById('orientation-toggle').style.display = '';
  }

  function showEndGameMessage(winner) {
    let oldMessage = document.getElementById('game-end-message');
    if (oldMessage) {
      oldMessage.remove();
    }

    if (winner === 'user') {
      updateBanner('You Win! Restart to play again');
    }
    if (winner === 'computer') {
      updateBanner('You Lose! Restart to play again');
    }
    return;
  }

  function highlightBoardPreview(startRow, startCol, length, orientation) {
    removeBoardPreview();

    let isValid = true;
    let cellsToPreview = [];

    for (let i = 0; i < length; i++) {
      let r = orientation === 'horizontal' ? startRow : startRow + i;
      let c = orientation === 'horizontal' ? startCol + i : startCol;
      if (r < 0 || r >= 10 || c < 0 || c >= 10) {
        isValid = false;
        continue;
      }
      const cellElem = document.querySelector(
        `.cell[data-row="${r}"][data-col="${c}"]`
      );
      if (cellElem) {
        const userBoardData = gameController.getUserBoard().getBoard();
        if (userBoardData[r][c].ship) {
          isValid = false;
        }
        cellsToPreview.push(cellElem);
      } else {
        isValid = false;
      }
    }

    // Apply the preview effect
    cellsToPreview.forEach((cell) => {
      if (isValid) {
        cell.classList.add('preview-valid');
      } else {
        cell.classList.add('preview-invalid');
      }
    });
  }

  function removeBoardPreview() {
    document
      .querySelectorAll('.preview-valid, .preview-invalid')
      .forEach((cell) => {
        cell.classList.remove('preview-valid', 'preview-invalid');
      });
  }

  function updateBanner(message, active = false) {
    const banner = document.getElementById('message-banner');
    if (!banner) return;
    banner.textContent = message;
    if (active) {
      banner.classList.add('active');
    } else {
      banner.classList.remove('active');
    }
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
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (placingShips) {
          cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            let shipName =
              e.dataTransfer.getData('ship-name') || selectedShipName;
            let shipLength =
              +e.dataTransfer.getData('ship-length') || +selectedShipLength;
            const row = +cell.dataset.row;
            const col = +cell.dataset.col;
            highlightBoardPreview(row, col, shipLength, currentOrientation);
          });
          cell.addEventListener('dragleave', () => {
            removeBoardPreview();
          });
          cell.addEventListener('drop', (e) => {
            e.preventDefault();
            removeBoardPreview();
            let shipName =
              e.dataTransfer.getData('ship-name') || selectedShipName;
            let shipLength =
              +e.dataTransfer.getData('ship-length') || +selectedShipLength;
            const row = +cell.dataset.row;
            const col = +cell.dataset.col;

            const shipObj = ship(shipName, shipLength);
            const success = userBoard.placeShip(
              shipObj,
              row,
              col,
              currentOrientation
            );

            if (success) {
              const shipDiv = document.querySelector(
                `[data-name="${shipName}"]`
              );
              if (shipDiv) {
                shipDiv.remove();
              }

              if (!document.querySelector('.ship-draggable')) {
                placingShips = false;
                gameController.placeComputerShips();
                document.getElementById('ship-tray').style.display = 'none';
                document.getElementById('orientation-toggle').style.display =
                  'none';
                updateBanner('All ships placed! Start battle!', true);
              }
              Render.renderBoards(
                gameController.getUserBoard(),
                gameController.getComputerBoard()
              );
            } else {
              alert('Invalid ship placement!');
            }
          });

          cell.addEventListener('click', (e) => {
            // Only trigger on tap if a ship is selected (mobile or desktop)
            if (!selectedShipName || !selectedShipLength) return;

            const row = +cell.dataset.row;
            const col = +cell.dataset.col;
            const userBoardData = userBoard.getBoard();

            if (
              !isShipPlacementValid(
                userBoardData,
                row,
                col,
                selectedShipLength,
                currentOrientation
              )
            ) {
              alert('Invalid ship placement!');
              return;
            }

            const shipObj = ship(selectedShipName, selectedShipLength);
            const success = userBoard.placeShip(
              shipObj,
              row,
              col,
              currentOrientation
            );

            if (success) {
              const shipDiv = document.querySelector(
                `[data-name="${selectedShipName}"]`
              );
              if (shipDiv) shipDiv.remove();

              if (!document.querySelector('.ship-draggable')) {
                placingShips = false;
                gameController.placeComputerShips();
                document.getElementById('ship-tray').style.display = 'none';
                document.getElementById('orientation-toggle').style.display =
                  'none';
                updateBanner('All ships placed! Start battle!', true);
              }
              // Deselect after successful place
              selectedShipName = null;
              selectedShipLength = null;
              Render.renderBoards(
                gameController.getUserBoard(),
                gameController.getComputerBoard()
              );
            } else {
              alert('Invalid ship placement!');
            }
          });
        }

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
            if (placingShips === true) {
              return;
            }
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
      restartButton.id = 'restartButton';
      restartButton.classList.add('restartButton');
      restartButton.textContent = 'Restart Game';
      document.body.appendChild(restartButton);

      restartButton.addEventListener('click', () => {
        let oldMessage = document.getElementById('game-end-message');
        if (oldMessage) oldMessage.remove();

        renderShipTray();
        placingShips = true;

        gameController.startGame();
        Render.renderBoards(
          gameController.getUserBoard(),
          gameController.getComputerBoard()
        );
        updateBanner('Select a ship to place');
      });
    }
  }

  function isShipPlacementValid(
    board,
    startRow,
    startCol,
    shipLength,
    orientation
  ) {
    for (let i = 0; i < shipLength; i++) {
      let r = orientation === 'horizontal' ? startRow : startRow + i;
      let c = orientation === 'horizontal' ? startCol + i : startCol;
      if (r < 0 || r >= 10 || c < 0 || c >= 10) return false;
      if (board[r][c].ship) return false;
    }
    return true;
  }

  return {
    renderBoards,
    showEndGameMessage,
    restartGameRender,
    renderShipTray,
    updateBanner,
  };
})();

module.exports = Render;
