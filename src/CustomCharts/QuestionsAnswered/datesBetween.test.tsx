import { datesBetween } from './datesBetween';

describe('getting dates between two dates', () => {
  const left = new Date('2020-05-08 16:00:00.000000');
  const right = new Date('2020-05-08 18:00:00.000000');

  test('it gets one date between two dates', () => {
    const length = 1;
    const dates = datesBetween(left, right, length);
    expect(dates).toHaveLength(length);
    expect(dates[0]).not.toBe(left);
    expect(dates[length - 1]).not.toBe(right);
    expect(dates[0]).toStrictEqual(new Date('2020-05-08 17:00:00.000000'));
  });

  test('it gets two dates between two dates', () => {
    const length = 2;
    const dates = datesBetween(left, right, length);
    expect(dates).toHaveLength(length);
    expect(dates[0]).not.toBe(left);
    expect(dates[length - 1]).not.toBe(right);
    expect(dates[0]).toStrictEqual(new Date('2020-05-08 16:40:00.000000'));
    expect(dates[1]).toStrictEqual(new Date('2020-05-08 17:20:00.000000'));
  });

  test('it gets two dates between two dates', () => {
    const length = 5;
    const dates = datesBetween(left, right, length);
    expect(dates).toHaveLength(length);
    expect(dates[0]).not.toBe(left);
    expect(dates[length - 1]).not.toBe(right);
    expect(dates[0]).toStrictEqual(new Date('2020-05-08 16:20:00.000000'));
    expect(dates[1]).toStrictEqual(new Date('2020-05-08 16:40:00.000000'));
    expect(dates[2]).toStrictEqual(new Date('2020-05-08 17:00:00.000000'));
    expect(dates[3]).toStrictEqual(new Date('2020-05-08 17:20:00.000000'));
    expect(dates[4]).toStrictEqual(new Date('2020-05-08 17:40:00.000000'));
  });
});
