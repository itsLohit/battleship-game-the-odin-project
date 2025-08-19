const gameBoard = require('../factories/gameboard');
const ship = require('../factories/ship');

describe('gameboard', () => {
  test('creates a 10x10 board filled with x', () => {
    const gb = gameBoard.createGameBoard();
    const board = gb.getBoard();
    expect(board.length).toBe(10);
    expect(board[0].length).toBe(10);
    expect(board[0][0]).toBe('x');
  });

  test('places a ship horizontally on the board', () => {
    const gb = gameBoard.createGameBoard();
    const battleShip = ship('battleShip', 4);
    gb.placeShip(battleShip, 3, 2, 'horizontal');

    const board = gb.getBoard();
    expect(board[3][2].ship).toBe(battleShip);
    expect(board[3][3].ship).toBe(battleShip);
    expect(board[3][4].ship).toBe(battleShip);
    expect(board[3][5].ship).toBe(battleShip);
  });

  test('places a ship vertically on the board', () => {
    const gb = gameBoard.createGameBoard();
    const destroyer = ship('destroyer', 2);
    gb.placeShip(destroyer, 4, 5, 'vertical');

    const board = gb.getBoard();
    expect(board[4][5].ship).toBe(destroyer);
    expect(board[5][5].ship).toBe(destroyer);
  });

  test('doesnot allow ships to overlap', () => {
    const gb = gameBoard.createGameBoard();
    const ship1 = ship('submarine', 4);
    gb.placeShip(ship1, 0, 0, 'horizontal');

    const ship2 = ship('destroyer', 5);
    gb.placeShip(ship2, 0, 1, 'horizontal');

    const board = gb.getBoard();
    expect(board[0][1].ship).toBe(ship1);
    expect(board[0][3].ship).toBe(ship1);
    expect(board[0][5]).toBe('x');
  });

  test('doesnot allow ships to be placed outside the board', () => {
    const gb = gameBoard.createGameBoard();
    const ship1 = ship('submarine', 4);
    gb.placeShip(ship1, 0, 8, 'horizontal');
    const board = gb.getBoard();
    expect(board[0][8]).toBe('x');
    expect(board[0][9]).toBe('x');
  });

  test('records a hit or miss when the board is attacked', () => {
    const gb = gameBoard.createGameBoard();
    const ship1 = ship('submarine', 4);

    gb.placeShip(ship1, 3, 4, 'horizontal');
    gb.receiveAttack(3, 5);
    gb.receiveAttack(3, 6);
    gb.receiveAttack(3, 5);
    gb.receiveAttack(2, 4);
    gb.receiveAttack(4, 4);

    const board = gb.getBoard();

    expect(board[3][5].status).toBe('hit');
    expect(board[3][6].status).toBe('hit');
    expect(board[2][4]).toBe('miss');
    expect(board[4][4]).toBe('miss');
    expect(board[4][5]).toBe('x');
    expect(ship1.getHits()).toBe(2);
  });

  test('detects when all the ships are sunk', () => {
    const gb = gameBoard.createGameBoard();
    const submarine = ship('submarine', 4);
    const destroyer = ship('destroyer', 3);
    gb.placeShip(submarine, 0, 0, 'horizontal');
    gb.placeShip(destroyer, 1, 0, 'vertical');

    gb.receiveAttack(0, 0);
    gb.receiveAttack(0, 1);
    gb.receiveAttack(0, 2);
    gb.receiveAttack(0, 3);

    gb.receiveAttack(1, 0);
    gb.receiveAttack(2, 0);
    gb.receiveAttack(3, 0);

    expect(gb.allShipsSunk()).toBeTruthy();
  });

  test('detects when all the ships are sunk', () => {
    const gb = gameBoard.createGameBoard();
    const submarine = ship('submarine', 4);
    const destroyer = ship('destroyer', 3);
    gb.placeShip(submarine, 0, 0, 'horizontal');
    gb.placeShip(destroyer, 1, 0, 'vertical');

    gb.receiveAttack(0, 0);
    gb.receiveAttack(0, 1);
    gb.receiveAttack(0, 2);

    gb.receiveAttack(1, 0);
    gb.receiveAttack(2, 0);
    gb.receiveAttack(3, 0);

    expect(gb.allShipsSunk()).not.toBeTruthy();
  });

  test('does not count repeated attacks on the same cell as new hits or misses', () => {
    const gb = gameBoard.createGameBoard();
    const destroyer = ship('destroyer', 2);
    gb.placeShip(destroyer, 1, 1, 'vertical');

    gb.receiveAttack(1, 1);
    gb.receiveAttack(1, 1);
    gb.receiveAttack(1, 1);

    const board = gb.getBoard();

    expect(destroyer.getHits()).toBe(1);
    expect(board[1][1].status).toBe('hit');

    gb.receiveAttack(3, 3);
    gb.receiveAttack(3, 3);
    expect(board[3][3]).toBe('miss');
  });

  test('doesnot allow placing same ship multiple times', () => {
    const gb = gameBoard.createGameBoard();
    const cruiser = ship('cruiser', 3);
    gb.placeShip(cruiser, 0, 0, 'horizontal');
    gb.placeShip(cruiser, 2, 2, 'vertical');
    const board = gb.getBoard();

    expect(board[0][0].ship).toBe(cruiser);
    expect(board[2][2]).toBe('x');
  });

  test('doesnot allow attacks out of bound', () => {
    const gb = gameBoard.createGameBoard();
    const cruiser = ship('cruiser', 3);
    gb.placeShip(cruiser, 0, 0, 'horizontal');
    expect(gb.receiveAttack(12, 12)).toBe(false);
    expect(gb.receiveAttack(-1, 0)).toBe(false);
  });

  test('resetBoard clears all ships, hits, misses', () => {
    const gb = gameBoard.createGameBoard();
    const cruiser = ship('cruiser', 3);
    gb.placeShip(cruiser, 0, 0, 'horizontal');
    gb.receiveAttack(0, 1);
    gb.receiveAttack(0, 0);
    gb.receiveAttack(0, 2);
    gb.receiveAttack(0, 3);

    expect(cruiser.getHits()).toBe(3);
    expect(cruiser.isSunk()).toBe(true);

    gb.resetBoard();
    const board = gb.getBoard();

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        expect(board[row][col]).toBe('x');
      }
    }
    expect(gb.allShipsSunk()).toBe(false);
    expect(gb.getShipsArrayLength()).toBe(0);

    expect(cruiser.getHits()).toBe(0);
    expect(cruiser.isSunk()).toBe(false);
  });
});
