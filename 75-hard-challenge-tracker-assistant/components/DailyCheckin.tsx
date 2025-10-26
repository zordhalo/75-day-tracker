import React, { useState, useCallback, ChangeEvent } from 'react';
import { TOTAL_DAYS } from '../constants';
import type { Task, TaskId, DayData } from '../types';
import TaskItem from './TaskItem';
import { CameraIcon, CheckCircleIcon } from './Icons';

interface DailyCheckinProps {
  currentDay: number;
  onCompleteDay: (newDayData: Omit<DayData, 'day' | 'date'>) => void;
  onResetChallenge: () => void;
  isCheckinDone: boolean;
  tasks: Task[];
}

const DailyCheckin: React.FC<DailyCheckinProps> = ({ currentDay, onCompleteDay, onResetChallenge, isCheckinDone, tasks }) => {
  const [completedTasks, setCompletedTasks] = useState<Record<TaskId, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    tasks.forEach(task => {
        initialState[task.id] = false;
    });
    return initialState as Record<TaskId, boolean>;
  });
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const handleTaskToggle = useCallback((taskId: TaskId) => {
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  }, []);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhoto(base64String);
        setPhotoPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const allTasksCompleted = Object.values(completedTasks).every(Boolean);
  const photoTaskChecked = completedTasks.photo;

  const handleSubmit = () => {
    if (!allTasksCompleted) {
      if (window.confirm("You haven't completed all tasks. According to the rules, this requires a reset. Do you want to reset to Day 1?")) {
        onResetChallenge();
      }
      return;
    }
    
    if (photoTaskChecked && !photo) {
        setError("You've checked off the photo task, but haven't uploaded an image.");
        return;
    }

    setError('');
    onCompleteDay({ tasks: completedTasks, photo, notes });
  };
  
  if (isCheckinDone) {
      return (
          <div className="bg-dark-card p-8 rounded-lg text-center shadow-lg">
              <CheckCircleIcon className="w-16 h-16 text-brand-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Day {currentDay - 1} Complete!</h2>
              <p className="text-medium-text">Awesome work. Consistency is key. Come back tomorrow to check in for Day {currentDay}.</p>
          </div>
      )
  }

  if (currentDay > TOTAL_DAYS) {
    return (
      <div className="bg-dark-card p-8 rounded-lg text-center shadow-lg">
          <span className="text-5xl mb-4 block">🎉</span>
          <h2 className="text-3xl font-bold mb-2 text-brand-primary">CONGRATULATIONS!</h2>
          <p className="text-medium-text">You have successfully completed the 75 Hard challenge. You have proven your mental toughness.</p>
      </div>
    )
  }

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-center">Check-in for Day {currentDay}</h2>
      
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            isChecked={completedTasks[task.id]}
            onToggle={() => handleTaskToggle(task.id)}
          />
        ))}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="photo-upload" className="font-semibold text-medium-text">Progress Photo</label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer bg-dark-border px-4 py-2 rounded-lg hover:bg-gray-600">
            <CameraIcon className="w-5 h-5"/>
            <span>{photo ? 'Change Photo' : 'Upload Photo'}</span>
            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload}/>
          </label>
        {photoPreview && <img src={photoPreview} alt="Progress preview" className="w-16 h-16 rounded-lg object-cover" />}
      </div>
      {/* FIX: Added missing closing div tag for the photo upload section. */}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="font-semibold text-medium-text">Notes & Reflections</label>
        <textarea
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How did today go? Any challenges or wins?"
          className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
          rows={3}
        />
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full bg-brand-primary text-dark-bg font-bold py-3 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {allTasksCompleted ? `Complete Day ${currentDay}` : 'Log Day (Incomplete)'}
      </button>

    </div>
  );
};

export default DailyCheckin;