import React, { useState, useMemo, useEffect } from 'react';
import { densityAtTime } from './KDE';
import { AddClicksEvent } from './../../Types';
import { VictoryGroup, VictoryChart, VictoryArea } from 'victory';
import theme from './../../theme';
import { minutesRange } from './minutesRange';
import { useKernelDensity } from './useKernelDensity';

type Props = {
  events: AddClicksEvent[];
  userId: number;
  startTime: Date;
  endTime: Date;
  key: string;
};

// Tries to visualize click events using Cloud Lines, where we determine the
// height of a cloud based on its kernel density estimation
const TeamAddClicksCloudLines = ({
  events,
  userId,
  startTime,
  endTime,
  key,
  // Not sure why, but we have to pass all props to the VictoryChart, otherwise
  // our custom VictoryArea won't be shown
  ...props
}: Props) => {
  const [data, setData] = useState(
    [] as { x: Date; y: number | null; y0: number | null }[]
  );
  const minutes = minutesRange(startTime, endTime, 1);
  useKernelDensity({ minutes, userId }).then(setData);

  return (
    <VictoryGroup {...props}>
      <VictoryArea
        interpolation="natural"
        data={data}
        y0={(d) => d.y0}
        style={{ data: { fill: theme.scoreAreaBackgroundColor } }}
      />
    </VictoryGroup>
  );
};

export default TeamAddClicksCloudLines;
