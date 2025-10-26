
import { useState, useEffect, useCallback } from 'react';
import type { ChallengeData, DayData, Task } from '../types';

const CHALLENGE_KEY = '75HardChallengeData';

const initialChallengeData: ChallengeData = {
  startDate: null,
  currentDay: 0,
  history: [],
  customTasks: [],
};

export const useChallenge = () => {
  const [challengeData, setChallengeData] = useState<ChallengeData>(initialChallengeData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(CHALLENGE_KEY);
      if (storedData) {
        setChallengeData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to parse challenge data from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challengeData));
    }
  }, [challengeData, loading]);

  const startChallenge = useCallback((tasks: Task[]) => {
    const newChallenge: ChallengeData = {
      startDate: new Date().toISOString(),
      currentDay: 0,
      history: [],
      customTasks: tasks,
    };
    setChallengeData(newChallenge);
  }, []);

  const addDay = useCallback((newDayData: Omit<DayData, 'day' | 'date'>) => {
    setChallengeData(prevData => {
      const nextDayNumber = prevData.currentDay + 1;
      const completeDayData: DayData = {
        ...newDayData,
        day: nextDayNumber,
        date: new Date().toISOString(),
      };
      return {
        ...prevData,
        currentDay: nextDayNumber,
        history: [...prevData.history, completeDayData],
      };
    });
  }, []);

  const resetChallenge = useCallback(() => {
    if (window.confirm("Are you sure you want to reset your progress and start over? This action cannot be undone.")) {
        setChallengeData(initialChallengeData);
    }
  }, []);

  return { challengeData, startChallenge, addDay, resetChallenge, loading };
};
