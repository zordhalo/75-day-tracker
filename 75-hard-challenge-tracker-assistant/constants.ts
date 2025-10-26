
import type { Task } from './types';

export const DEFAULT_TASKS: Task[] = [
  { id: 'workout1', label: 'First 45+ min Workout', description: 'Any workout, indoor or outdoor.' },
  { id: 'workout2', label: 'Second 45+ min Workout', description: 'Must be completed outdoors.' },
  { id: 'diet', label: 'Follow Your Diet', description: 'No cheat meals or alcohol.' },
  { id: 'water', label: 'Drink 1 Gallon of Water', description: 'Approximately 3.78 liters.' },
  { id: 'read', label: 'Read 10+ Pages', description: 'Non-fiction, self-help, or educational book.' },
  { id: 'photo', label: 'Take a Progress Photo', description: 'A daily photo to track your transformation.' },
];

export const TOTAL_DAYS = 75;
