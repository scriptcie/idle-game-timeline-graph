import React, { useEffect } from 'react';
import * as R from 'ramda';
import useLocalStorageState from 'use-local-storage-state';
import usersUrl from './data/users.txt';
import achievementsUrl from './data/achievements.txt';
import upgradesUrl from './data/upgrades.txt';
import questionsUrl from './data/questions.txt';
import eventsUrl from './data/events.txt';
import { Event, Upgrade, Question, Achievement, User } from './Types';

type Achievements = { [key: string]: Achievement };
type Upgrades = { [key: string]: Upgrade };
type Questions = { [key: string]: Question };

const DataContext = React.createContext({
  users: [] as User[],
  achievements: {} as Achievements,
  upgrades: {} as Upgrades,
  questions: {} as Questions,
  events: [] as Event[],
});
DataContext.displayName = 'DataContext';

const useRawCrashAndCompileData = () => {
  const [users, setUsers] = useLocalStorageState(
    'idle_game_stats_users',
    [] as User[]
  );
  // const [users, setUsers] = useState([] as User[]);
  const [events, setEvents] = useLocalStorageState(
    'idle_game_stats_events',
    [] as Event[]
  );
  const [questions, setQuestions] = useLocalStorageState(
    'idle_game_stats_questions',
    {} as Questions
  );
  const [upgrades, setUpgrades] = useLocalStorageState(
    'idle_game_stats_upgrades',
    {} as Upgrades
  );
  const [achievements, setAchievements] = useLocalStorageState(
    'idle_game_stats_achievements',
    {} as Achievements
  );

  if (events.length !== 0 && !(events[0].time instanceof Date)) {
    setEvents(
      events.map(
        (event: Event): Event => ({ ...event, time: new Date(event.time) })
      )
    );
  }

  useEffect(() => {
    if (events.length === 0) {
      console.log('Fetching events', events.length);
      fetch(eventsUrl)
        .then((response) => response.json())
        .then((events) =>
          events
            .map(
              (event: Event): Event => {
                let time = new Date(event.time);
                // Our vents are given in utc time, we could format our dates and use tickFormat, but whatever..
                time.setHours(time.getHours() + 2);
                return {
                  ...event,
                  time: time,
                };
              }
            )
            .filter(
              ({ time }: { time: Date }) =>
                time < new Date('2020-05-09 3:00:00')
            )
        )
        .then(setEvents);
      return;
    }
  }, [events, setEvents]);

  useEffect(() => {
    if (Object.keys(questions).length === 0) {
      console.log('fetching questions');
      fetch(questionsUrl)
        .then((response) => response.json())
        .then(setQuestions);
    }
  }, [questions, setQuestions]);

  useEffect(() => {
    if (Object.keys(upgrades).length === 0) {
      console.log('fetching upgrades');
      fetch(upgradesUrl)
        .then((response) => response.json())
        .then(setUpgrades);
    }
  }, [upgrades, setUpgrades]);

  useEffect(() => {
    if (users.length === 0) {
      console.log('Fetching users', users.length);
      fetch(usersUrl)
        .then((response) => response.json())
        .then(setUsers);
    }
  }, [users, setUsers]);

  useEffect(() => {
    if (Object.keys(achievements).length === 0) {
      console.log('fetching achievements');

      fetch(achievementsUrl)
        .then((response) => response.json())
        .then(setAchievements);
    }
  }, [achievements, setAchievements]);

  console.log({
    users: users.length,
    events: events.length,
    questions: Object.keys(questions).length,
    upgrades: Object.keys(upgrades).length,
    achievements: Object.keys(achievements).length,
  });

  return {
    users,
    events,
    questions,
    upgrades,
    achievements,
  };
};

export const DataProvider = ({ children }: { children: any }) => {
  const values = useRawCrashAndCompileData();
  if (
    values.events.length === 0 ||
    values.users.length === 0 ||
    Object.keys(values.achievements).length === 0 ||
    Object.keys(values.upgrades).length === 0 ||
    Object.keys(values.questions).length === 0
  ) {
    return (
      <DataContext.Provider value={values}>
        <div>Loading</div>
      </DataContext.Provider>
    );
  }
  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};

export function useData() {
  const context = React.useContext(DataContext);

  if (context === undefined) {
    throw new Error(`useData must be used within a DataProvider`);
  }
  return context;
}

export function useEventNames() {
  const { events } = useData();

  return R.uniqBy(({ name }) => name, events).map(({ name }) => name);
}

export function useTeamNames() {
  const { users } = useData();

  return R.map(({ username }) => username, users);
}
