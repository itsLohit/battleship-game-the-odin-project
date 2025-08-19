const ship = require('../factories/ship');

describe('ship', () => {
  test('ship gets hit', () => {
    const boat = ship('submarine', 3);
    boat.hit();
    expect(boat.getHits()).toBe(1);
  });
  test('ship is sunk to be true', () => {
    const boat = ship('submarine', 3);
    boat.hit();
    boat.hit();
    boat.hit();
    expect(boat.isSunk()).toBeTruthy();
  });
  test('ship is sunk to be false', () => {
    const boat = ship('submarine', 3);
    boat.hit();
    expect(boat.isSunk()).not.toBeTruthy();
  });
});
