import { densityAtTime, epanechnikov, kde } from './KDE';

describe('Kernel density estimator', () => {
  test('Computing the kernel density estimator at points', () => {
    const result = kde(epanechnikov(1.0), [1.0, 2.0], [1.0, 2.0]);

    expect(result).toStrictEqual([
      [1, 0.0075],
      [2, 0.0075],
    ]);
  });
});

describe('density of events at time', () => {
  test('computing the kde of events', () => {
    const f = densityAtTime(
      [{ time: new Date('2020-05-08 16:00:00.000000') }],
      1.0
    );

    expect(f([new Date('2020-05-08 16:00:00.000000')])).toStrictEqual([
      [new Date('2020-05-08 16:00:00.000000'), 0.0075],
    ]);

    expect(f([new Date('2020-05-09 16:00:00.000000')])).toStrictEqual([
      [new Date('2020-05-09 16:00:00.000000'), 0.0],
    ]);
  });
});
