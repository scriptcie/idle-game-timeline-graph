import React, { useMemo } from 'react';
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryLabel,
  VictoryAxis,
  VictoryScatter,
} from 'victory';
import * as R from 'ramda';
import {
  AnswerQuestionEvent,
  WrongAnswerEvent,
  EventName,
} from './../../Types';
import { useData } from './../../DataContext';
import eventStyle, { scatterStyle } from './../../eventStyle';
import { datesBetween } from './datesBetween';

type QuestionEvent = AnswerQuestionEvent | WrongAnswerEvent;

const QuestionsAnsweredGraph = ({
  startDate,
  endDate,
  ...props
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const { events, questions } = useData();
  const answeredQuestions = useMemo(() => {
    return events
      .filter((event) => startDate < event.time && event.time < endDate)
      .filter((event): event is QuestionEvent =>
        ['answer_question', 'wrong_answer'].includes(event.name)
      )
      .map((event) => {
        return {
          ...event,
          ...eventStyle[event.name as EventName],
          x: event.time,
          y: event.payload ? event.payload.user_id : 1,
        };
      });
  }, [events, startDate, endDate]);

  const answerQuestionEventsByQuestion = R.groupBy(
    (event) => event.payload.question,
    events
      .filter((event) => startDate < event.time && event.time < endDate)
      .filter(
        (event): event is QuestionEvent => event.name === 'answer_question'
      )
  );

  console.log(
    answerQuestionEventsByQuestion,
    answerQuestionEventsByQuestion[Object.keys(questions)[0]],
    Object.keys(answerQuestionEventsByQuestion),
    Object.keys(questions)
  );

  const startOrStopEvents = events.filter(({ name }) =>
    ['game_started', 'game_stopped'].includes(name)
  );

  if (answeredQuestions.length < 1) {
    return <div>Hoi</div>;
  }
  const questionDates = datesBetween(
    startOrStopEvents[0].time,
    startOrStopEvents[1].time,
    8
  );

  return (
    <VictoryChart {...props}>
      {Object.entries(answerQuestionEventsByQuestion).map(
        ([question, events], key) => {
          console.log(question, Object.keys(questions).indexOf(question));

          const x = questionDates[Object.keys(questions).indexOf(question)];

          return (
            <VictoryLine
              key={key}
              interpolation={'monotoneY'}
              style={{ data: { stroke: '#efefef' } }}
              sortKey="key"
              data={[
                {
                  x: x,
                  y: 20,
                  key: 0,
                },
                ...events.map((event, key) => ({
                  key: key + 1,
                  x: event.time,
                  y: event.payload.user_id,
                })),
              ]}
            />
          );
        }
      )}
      {Object.entries(answerQuestionEventsByQuestion).map(
        ([question, events], key) => {
          console.log(question, Object.keys(questions).indexOf(question));

          const labelX = new Date(events[0].time);
          // labelX.setMinutes(labelX.getMinutes() - 5);

          return (
            <VictoryLabel
              key={`label_${key}`}
              text={question}
              angle={90}
              x={labelX.getTime()}
              y={20}
            />
          );
        }
      )}
      <VictoryScatter
        data={answeredQuestions.filter(({ name }) => name === 'wrong_answer')}
        labelComponent={<VictoryLabel dy={4.5} />}
        style={scatterStyle}
      />
      <VictoryScatter
        data={answeredQuestions.filter(
          ({ name }) => name === 'answer_question'
        )}
        labels={({ datum }) =>
          Object.keys(questions).indexOf(datum.payload.question) + 1
        }
        labelComponent={<VictoryLabel dy={4.5} />}
        style={scatterStyle}
      />
      <VictoryAxis
        tickLabelComponent={
          <VictoryLabel dx={30} angle={-90} textAnchor="start" />
        }
        tickValues={questionDates}
        tickFormat={Object.values(questions).map(({ name }) => name)}
        axisValue={20}
        style={{
          tickLabels: { fontSize: 8 },
          axis: undefined,
        }}
      />
    </VictoryChart>
  );
};

export default QuestionsAnsweredGraph;
