const ship = require('../factories/ship');

describe('ship', () => {
  test('ship gets hit', () => {
    const boat = ship(3);
    boat.hit();
    expect(boat.getHits()).toBe(1);
  });
  test('ship is sunk to be true', () => {
    const sumbarine = ship(4);
    sumbarine.hit();
    sumbarine.hit();
    sumbarine.hit();
    sumbarine.hit();
    expect(sumbarine.isSunk()).toBeTruthy();
  });
  test('ship is sunk to be false', () => {
    const sumbarine = ship(4);
    sumbarine.hit();
    sumbarine.hit();
    sumbarine.hit();
    expect(sumbarine.isSunk()).not.toBeTruthy();
  });
});
