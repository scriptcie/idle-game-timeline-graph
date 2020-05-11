import React from 'react';
import { VictoryChart, VictoryArea } from 'victory';
import { useData } from './../../DataContext';

const PausedIntervals = (props: any) => {
  const { events, users } = useData();

  const startOrStopEvents = events.filter(({ name }) =>
    ['game_started', 'game_stopped'].includes(name)
  );

  const pausedIntervals = [
    [events[0].time, startOrStopEvents[0].time],
    [startOrStopEvents[1].time, startOrStopEvents[2].time],
  ];

  return (
    <VictoryChart {...props}>
      {pausedIntervals.map(([left, right], idx) => (
        <VictoryArea
          key={idx}
          data={[
            { x: left, y: 0 },
            { x: left, y: users.length + 2 },
            { x: right, y: users.length + 2 },
            { x: right, y: 0 },
          ]}
          style={{ data: { fill: 'var(--paused-background-color)' } }}
        />
      ))}
    </VictoryChart>
  );
};

export default PausedIntervals;
