import React, { useMemo } from 'react';
import { useData } from './../../DataContext';
import { Event, AddClicksEvent } from './../../Types';
import { densityAtTime } from './KDE';

// The bandwidth used by our KDE, its value was determined manually by "the value that looks good"
const bandwidth = 1.9;

export const useKernelDensity = async ({
  minutes,
  userId,
}: {
  minutes: Date[];
  userId: number;
}) => {
  const { events, questions } = useData();

  const clickEvents = events
    .filter(
      (event: Event): event is AddClicksEvent => event.name === 'add_clicks'
    )
    .filter(
      ({ payload }: { payload: { user_id: number } }) =>
        payload.user_id === userId
    );

  return useMemo(() => {
    console.log('computing');
    return densityAtTime(
      clickEvents,
      bandwidth
    )(minutes)
      .map(([x, y0]) => {
        const y = Math.min(0.6, y0);
        return { x, y: userId + y, y0: userId - y };
      })
      .map((d, idx, data) => {
        const { y, y0 } = d;

        if (y !== y0) {
          return d;
        }

        const previous = idx > 1 ? data[idx - 1] : { y, y0 };
        if (previous.y !== previous.y0) {
          return d;
        }

        const next = idx + 1 < data.length ? data[idx + 1] : { y, y0 };
        if (next.y !== next.y0) {
          return d;
        }

        // Don't show the area when the click density is constantly zero
        return { x: d.x, y: null, y0: null };
      });
  }, [events]);
};
