
export type TaskId = 'workout1' | 'workout2' | 'diet' | 'water' | 'read' | 'photo';

export interface Task {
  id: TaskId;
  label: string;
  description: string;
}

export interface DayData {
  day: number;
  date: string;
  tasks: Record<TaskId, boolean>;
  photo: string | null;
  notes: string;
}

export interface ChallengeData {
  startDate: string | null;
  currentDay: number;
  history: DayData[];
  customTasks: Task[];
}
