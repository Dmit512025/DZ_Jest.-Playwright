const { sortByName } = require('../../app');

describe('Books names test suite', () => {
  it('should sort book names in ascending order (Cyrillic)', () => {
    const input = [
      'Гарри Поттер',
      'Властелин Колец',
      'Волшебник изумрудного города',
    ];
    const expected = [
      'Властелин Колец',
      'Волшебник изумрудного города',
      'Гарри Поттер',
    ];
    expect(sortByName(input)).toEqual(expected);
  });
});

test('sortByName handles Latin names with mixed case', () => {
  const input = ['banana', 'Apple', 'cherry', 'apple'];
  const expected = ['Apple', 'apple', 'banana', 'cherry'];
  expect(sortByName(input)).toEqual(expected);
});

test('sortByName handles equal names (case-insensitive) to cover the return 0 branch', () => {

  const input = ['Apple', 'apple', 'APPLE'].slice();
  const result = sortByName(input);

  expect(result).toEqual(['Apple', 'apple', 'APPLE']);
});
