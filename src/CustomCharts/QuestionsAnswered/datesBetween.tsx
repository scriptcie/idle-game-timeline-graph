import * as R from 'ramda';

export const datesBetween = (
  left: Date,
  right: Date,
  amount: number
): Date[] => {
  const leftTime = left.getTime();
  const rightTime = right.getTime();
  const difference = rightTime - leftTime;

  return R.range(1, amount + 1)
    .map((idx) => {
      return leftTime + (idx * difference) / (amount + 1);
    })
    .map((time) => new Date(time));
};
