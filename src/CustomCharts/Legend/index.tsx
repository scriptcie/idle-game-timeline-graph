import React from 'react';
import { VictoryLegend } from 'victory';
import { EventName } from './../../Types';
import eventStyle from './../../eventStyle';

const Legend = ({ eventNames = Object.keys(eventStyle), ...props }) => {
  return (
    <VictoryLegend
      {...props}
      x={150}
      y={750}
      centerTitle
      orientation="horizontal"
      gutter={20}
      style={{
        title: { fontSize: 10 },
        parent: { fill: '#aaa' },
      }}
      data={eventNames.map((name) => {
        const style = eventStyle[name as EventName];
        return {
          name,
          symbol: { fill: style.fill, type: style.symbol, ...style },
        };
      })}
    />
  );
};

export default Legend;
