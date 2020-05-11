import React, { useMemo } from 'react';
import { DataProvider, useData } from './DataContext';
import { Event, EventName, AddClicksEvent } from './Types';
import * as V from 'victory';
import eventStyle, { scatterStyle } from './eventStyle';
import Legend from './CustomCharts/Legend/';
import TeamAddClicksCloudLines from './CustomCharts/KernelDensityArea/';
import PausedIntervals from './CustomCharts/PausedIntervals/';
import QuestionsAnsweredGraph from './CustomCharts/QuestionsAnswered/';

const {
  VictoryLabel,
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryZoomContainer,
} = V;

const ZoomableGraph = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const { events, users } = useData();
  const eventData = useMemo(() => {
    return events
      .filter((event) => startDate < event.time && event.time < endDate)
      .filter(
        (event) =>
          ![
            'answer_question',
            'wrong_answer',
            'game_started',
            'game_stopped',
            'add_clicks',
            'buy_upgrade',
          ].includes(event.name)
      )
      .map((event) => {
        const y = event.payload ? event.payload.user_id : 1;
        const style = eventStyle[event.name as EventName];
        return {
          ...event,
          ...style,
          x: event.time,
          y,
        };
      });
  }, [events, startDate, endDate]);

  if (events.length === 0) {
    return <div>Hoi, loading data</div>;
  }

  const addClickEvents: AddClicksEvent[] = events.filter(
    (event: Event): event is AddClicksEvent => event.name === 'add_clicks'
  );

  const startEvent = events.find(({ name }) => name === 'game_started') || {
    time: events[0].time,
  };

  return (
    <div>
      <VictoryChart
        theme={V.VictoryTheme.material}
        maxDomain={{ y: 28 }}
        minDomain={{ y: 0 }}
        padding={{ bottom: 100, top: 0, left: 0, right: 0 }}
        width={1600}
        height={800}
        scale={{ x: 'time' }}
        containerComponent={<VictoryZoomContainer zoomDimension="x" />}
      >
        <PausedIntervals />
        {users.map(({ id }: { id: number }) => (
          <TeamAddClicksCloudLines
            key={`add_click_cloud_lines_${id}`}
            events={addClickEvents}
            userId={id}
            startTime={events[0].time}
            endTime={events[events.length - 1].time}
          />
        ))}
        <VictoryScatter data={eventData} style={scatterStyle} />
        <QuestionsAnsweredGraph startDate={startDate} endDate={endDate} />
        <VictoryAxis
          padding={{ left: 100, right: 100 }}
          tickLabelComponent={<VictoryLabel dx={-2} angle={-33} />}
          dependentAxis
          tickValues={users.map(({ id }) => id)}
          tickFormat={users.map(({ username }) => username)}
          axisValue={startEvent.time}
        />
        <VictoryAxis />
        <Legend
          eventNames={[
            'buy_question',
            // 'add_clicks',
            'wrong_answer',
            'answer_question',
            // 'buy_upgrade',
            'unlock_achievement',
            // 'add_score',
          ]}
        />
      </VictoryChart>
    </div>
  );
};

function CrashAndCompile() {
  const { events } = useData();

  const startDate = new Date(
    events.length > 0 ? events[0].time : '2020-05-08 16:14:19.923024'
  );
  startDate.setHours(startDate.getHours());
  const endDate = new Date(
    events.length > 0 ? events[events.length - 1].time : '2020-05-08 23:45:00'
  );
  endDate.setHours(endDate.getHours() + 2);

  return <ZoomableGraph startDate={startDate} endDate={endDate} />;
}

function App() {
  return (
    <DataProvider>
      <CrashAndCompile />
    </DataProvider>
  );
}

export default App;
