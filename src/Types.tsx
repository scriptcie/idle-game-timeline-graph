export type UserId = number;
export type QuestionId = string;
export type UpgradeId = string;
export type AchievementId = string;
export type User = {
  id: UserId;
  username: string;
  password: string;
  admin: number;
};

export type Achievement = {
  name: string;
  description: string;
  'challenge points': number;
  bps?: number;
  bpc?: number;
  requirement:
    | { clicks: number }
    | { manual: string }
    | { balls: number }
    | { questions_answered: number }
    | { crash_points: number }
    | { upgrades_bought: number }
    | { wrongly_answered: number }
    | { min_points_in_comps: number };
};

export type Upgrade = {
  name: string;
  base_price: number;
  base_bps: number;
  requirement: QuestionId;
};
export type Question = {
  name: string;
  points: number;
  price: number;
};

export type EventName =
  | 'unlock_achievement'
  | 'game_started'
  | 'add_clicks'
  | 'buy_question'
  | 'wrong_answer'
  | 'answer_question'
  | 'buy_upgrade'
  | 'add_score'
  | 'game_stopped';

export type AnswerQuestionEvent = {
  name: 'answer_question';
  payload: {
    user_id: UserId;
    question: QuestionId;
  };
  id: number;
  time: Date;
};
export type UnlockAchievementEvent = {
  name: 'unlock_achievement';
  payload: { user_id: UserId; achievement: AchievementId };
  id: number;
  time: Date;
};
export type GameStartedEvent = {
  name: 'game_started';
  payload: null;
  id: number;
  time: Date;
};
export type AddClicksEvent = {
  name: 'add_clicks';
  payload: {
    user_id: UserId;
    clicks: number;
  };
  id: number;
  time: Date;
};
export type BuyQuestionEvent = {
  name: 'buy_question';
  payload: {
    user_id: UserId;
    question: QuestionId;
  };
  id: number;
  time: Date;
};
export type WrongAnswerEvent = {
  name: 'wrong_answer';
  payload: {
    user_id: UserId;
    question: QuestionId;
  };
  id: number;
  time: Date;
};
export type BuyUpgradeEvent = {
  name: 'buy_upgrade';
  payload: {
    user_id: UserId;
    upgrade: UpgradeId;
  };
  id: number;
  time: Date;
};
export type AddScoreEvent = {
  name: 'add_score';
  payload: {
    user_id: UserId;
    category: string;
    score: number;
  };
  id: number;
  time: Date;
};
export type GameStoppedEvent = {
  name: 'game_stopped';
  payload: null;
  id: number;
  time: Date;
};
export type Event =
  | AnswerQuestionEvent
  | UnlockAchievementEvent
  | GameStartedEvent
  | AddClicksEvent
  | BuyQuestionEvent
  | WrongAnswerEvent
  | BuyUpgradeEvent
  | AddScoreEvent
  | GameStoppedEvent;

export function isAnswered(event: Event): event is AnswerQuestionEvent {
  return (event as AnswerQuestionEvent).name === 'answer_question';
}
