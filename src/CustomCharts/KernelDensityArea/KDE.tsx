import * as R from 'ramda';

// Assumption: observations[] is an ordered list of numbers and xs are the
// points at which we want to compute the kde
export function kde(
  kernel: (x: number) => number,
  xs: number[],
  observations: number[]
) {
  const dataBandwidth = 500;
  const normalize = 100;

  // Performance optimization: allows us to find entry in observations that is nearest
  // to the current number in xs, assuming observations are sorted
  let lastKnownIndex = 0;

  // TODO replace with a reduce / hide away the lastKnownIndex into an immutable thing
  return R.map((x: number) => {
    // Find the index of the entry in observations that is closes to x
    const idx = Math.max(
      0,
      R.reduceWhile(
        (idx) => observations[idx] < x,
        (idx) => idx + 1,
        lastKnownIndex,
        observations
      ) - 1
    );
    lastKnownIndex = idx;

    // Instead of computing the kernel for each observation, we filter
    // out observations "far away" from the current time
    const filteredData = R.take(
      2 * dataBandwidth,
      R.drop(Math.max(0, idx - dataBandwidth), observations)
    );

    // NOTE: normally this would be R.mean, but since we're dealing with a dynamic
    // bandwith I've found that normalizing the kde gives nicer looking results
    const y = R.sum(R.map((d) => kernel(x - d), filteredData)) / normalize;

    return [x, y];
  }, xs);
}

export function epanechnikov(bandwidth: number) {
  return (x: number) =>
    Math.abs((x /= bandwidth)) <= 1 ? (0.75 * (1 - x * x)) / bandwidth : 0;
}

type EventWithTime = { time: Date };

export const densityAtTime = (events: EventWithTime[], bandwidth = 7.0) => {
  const secondInMilliseconds = 1000;
  const convertToSeconds = (time: Date) =>
    time.getTime() / secondInMilliseconds;

  const observationsInSeconds = R.pipe(
    R.map((x: { time: Date }) => x.time),
    R.map(convertToSeconds)
  );
  const observations = observationsInSeconds(events);

  return (computeDensityAt: Date[]): [Date, number][] =>
    R.map(
      ([t, y]) => [new Date(secondInMilliseconds * t), y],
      kde(
        epanechnikov(bandwidth),
        R.map(convertToSeconds, computeDensityAt),
        observations
      )
    );
};
