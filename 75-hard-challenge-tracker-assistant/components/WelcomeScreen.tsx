
import React, { useState } from 'react';
import { TargetIcon } from './Icons';
import { DEFAULT_TASKS } from '../constants';
import type { Task } from '../types';

interface WelcomeScreenProps {
  onStart: (tasks: Task[]) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [customTasks, setCustomTasks] = useState<Task[]>(DEFAULT_TASKS);

  const handleTaskChange = (index: number, field: 'label' | 'description', value: string) => {
    const updatedTasks = [...customTasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setCustomTasks(updatedTasks);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg p-4 text-center">
      <div className="max-w-2xl w-full">
        <TargetIcon className="w-24 h-24 text-brand-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-4">
          Welcome to the Challenge
        </h1>
        <p className="text-lg text-medium-text mb-8">
          This is a mental toughness program designed to change your life. Define your rules and commit to them for 75 days.
        </p>

        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-8 text-left space-y-5">
            <h2 className="text-2xl font-semibold text-brand-primary mb-3">Set Your Daily Rules:</h2>
            {customTasks.map((task, index) => (
              <div key={task.id} className="space-y-2 border-b border-dark-border/50 pb-4 last:border-b-0 last:pb-0">
                  <label className="text-light-text font-semibold block text-sm">Rule #{index + 1} Title</label>
                  <input
                      type="text"
                      value={task.label}
                      onChange={(e) => handleTaskChange(index, 'label', e.target.value)}
                      className="w-full bg-dark-bg p-2 rounded-md border border-dark-border focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                      placeholder="e.g., First 45-min Workout"
                  />
                  <label className="text-medium-text font-semibold block text-sm">Description</label>
                  <textarea
                      value={task.description}
                      onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                      className="w-full bg-dark-bg p-2 rounded-md border border-dark-border focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                      placeholder="e.g., Must be outdoors"
                      rows={2}
                  />
              </div>
          ))}
        </div>

        <button
          onClick={() => onStart(customTasks)}
          className="bg-brand-primary text-dark-bg font-bold py-4 px-10 rounded-full text-xl hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300 shadow-lg shadow-brand-primary/20"
        >
          I'm In. Start Day 1.
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
