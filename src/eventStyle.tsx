import { EventName } from './Types';

type EventMap<T> = { [event in EventName]: T };

// Allowed symbols
type Symbol =
  | 'circle'
  | 'diamond'
  | 'plus'
  | 'minus'
  | 'square'
  | 'star'
  | 'triangleDown'
  | 'triangleUp';

// Having a separate export allows us to reuse the style definition of the
// symbols used in our scatter plot and the legend
const eventStyle: EventMap<{
  symbol: Symbol;
  size: number;
  fill: string;
  opacity?: number;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
}> = {
  game_started: { symbol: 'triangleUp', size: 5, fill: 'gray' },
  game_stopped: { symbol: 'triangleDown', size: 5, fill: 'gray' },
  add_clicks: { symbol: 'minus', size: 2, fill: '#eaeafa', opacity: 0.1 },
  buy_question: {
    symbol: 'circle',
    size: 4,
    opacity: 0.5,
    fill: 'tomato',
    stroke: 'green',
  },
  wrong_answer: {
    symbol: 'circle',
    size: 6,
    fill: 'var(--wrong-answer-background-color)',
    stroke: 'var(--wrong-answer-border-color)',
    opacity: 0.5,
    fillOpacity: 0.7,
    strokeWidth: 3,
  },
  answer_question: {
    symbol: 'circle',
    size: 10,
    fill: 'var(--question-answered-background-color)',
    stroke: 'var(--question-answered-border-color)',
    fillOpacity: 0.7,
    strokeWidth: 3,
  },
  buy_upgrade: { symbol: 'square', size: 3, fill: 'pink', opacity: 0.5 },
  unlock_achievement: { symbol: 'star', size: 3, fill: 'orange' },
  add_score: { symbol: 'star', size: 3, fill: 'orange' },
};

export const scatterStyle = {
  labels: {
    fill: '#fafafa',
    fontSize: ({ datum }: { datum: any }) => datum.size + 1,
  },
  data: {
    fill: ({ datum }: { datum: any }) => datum.fill,
    opacity: ({ datum }: { datum: any }) => datum.opacity,
    stroke: ({ datum }: { datum: any }) => (datum.stroke ? datum.stroke : null),
    strokeWidth: ({ datum }: { datum: any }) => (datum.stroke ? 2 : 0),
  },
};

export default eventStyle;
