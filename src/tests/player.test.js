const player = require('../factories/player');
const gameBoard = require('../factories/gameboard');
const ship = require('../factories/ship');

describe('player', () => {
  test('player has own gameboard', () => {
    const p1 = player('Peter');
    expect(p1.gameBoard).toBeDefined();
    expect(typeof p1.gameBoard.receiveAttack).toBe('function');
  });

  test('player can attack a given coordinate on opponents board', () => {
    const opponent = player('opponent');
    const battleship = ship('battleship', 4);
    opponent.gameBoard.placeShip(battleship, 0, 0, 'horizontal');
    const p1 = player('Peter');
    p1.attack(opponent.gameBoard, 0, 0);

    expect(battleship.getHits()).toBe(1);
  });

  test('computer can make random valid attack', () => {
    const p1 = player('Peter');
    const computer = player('Computer');
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        expect(p1.gameBoard.getBoard()[row][col]).toBe('x');
      }
    }
    computer.randomAttack(p1.gameBoard);
    let missCounter = 0;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (p1.gameBoard.getBoard()[row][col] === 'miss') {
          missCounter++;
        }
      }
    }
    expect(missCounter).toBe(1);
  });

  test('computer doesnot repeat random attack on same cell', () => {
    const p1 = player('Peter');
    const computer = player('Computer');
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        expect(p1.gameBoard.getBoard()[row][col]).toBe('x');
      }
    }
    for (let i = 0; i < 100; i++) {
      computer.randomAttack(p1.gameBoard);
    }
    let missCounter = 0;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (p1.gameBoard.getBoard()[row][col] === 'miss') {
          missCounter++;
        }
      }
    }
    expect(missCounter).toBe(100);
  });

  test('player type is correctly set to human or computer', () => {
    const humanPlayer = player('Peter', 'human');
    const computerPlayer = player('AI', 'computer');
    expect(humanPlayer.type).toBe('human');
    expect(computerPlayer.type).toBe('computer');
  });

  test('each player has seperate, individual gameboard', () => {
    const humanPlayer = player('Peter', 'human');
    const computerPlayer = player('AI', 'computer');
    const battleship = ship('battleship', 4);
    humanPlayer.gameBoard.placeShip(battleship, 2, 2, 'horizontal');
    humanPlayer.gameBoard.receiveAttack(2, 3);
    computerPlayer.gameBoard.receiveAttack(2, 3);
    expect(humanPlayer.gameBoard.getBoard()[2][3].status).toBe('hit');
    expect(computerPlayer.gameBoard.getBoard()[2][3]).toBe('miss');
  });

  test('attack results in hit if there is a ship, miss if not', () => {
    const p1 = player('Alice', 'human');
    const testShip = ship('TestShip', 2);
    p1.gameBoard.placeShip(testShip, 0, 0, 'horizontal');
    p1.gameBoard.receiveAttack(0, 0);
    expect(testShip.getHits()).toBe(1);
    expect(p1.gameBoard.getBoard()[0][0].status).toBe('hit');
    p1.gameBoard.receiveAttack(5, 5);
    expect(p1.gameBoard.getBoard()[5][5]).toBe('miss');
  });

  test('allShipsSunk returns true only when all ships are sunk', () => {
    const p1 = player('Alice', 'human');
    const testShip1 = ship('TestShip1', 2);
    const testShip2 = ship('TestShip2', 3);

    p1.gameBoard.placeShip(testShip1, 0, 0, 'horizontal');
    p1.gameBoard.placeShip(testShip2, 3, 3, 'horizontal');

    p1.gameBoard.receiveAttack(0, 0);
    p1.gameBoard.receiveAttack(0, 1);
    expect(p1.gameBoard.allShipsSunk()).toBe(false);

    p1.gameBoard.receiveAttack(3, 3);
    p1.gameBoard.receiveAttack(3, 4);
    p1.gameBoard.receiveAttack(3, 5);
    expect(p1.gameBoard.allShipsSunk()).toBe(true);
  });
});
