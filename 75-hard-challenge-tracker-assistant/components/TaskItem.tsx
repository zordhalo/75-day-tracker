
import React from 'react';
import type { Task } from '../types';
import { InfoIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  isChecked: boolean;
  onToggle: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isChecked, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
        isChecked ? 'bg-green-500/10 border-green-500' : 'bg-dark-bg border-dark-border hover:border-brand-primary/50'
      }`}
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-medium-text flex items-center justify-center mr-4">
        {isChecked && <div className="w-4 h-4 bg-brand-primary rounded-sm" />}
      </div>
      <div className="flex-grow">
        <p className={`font-semibold ${isChecked ? 'text-light-text' : 'text-medium-text'}`}>{task.label}</p>
      </div>
      <div className="group relative">
        <InfoIcon className="w-5 h-5 text-medium-text" />
        <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-48 bg-dark-bg border border-dark-border text-xs text-light-text p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {task.description}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
