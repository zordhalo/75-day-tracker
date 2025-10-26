
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { DayData, TaskId, Task } from '../types';

interface AnalyticsProps {
  history: DayData[];
  tasks: Task[];
}

const Analytics: React.FC<AnalyticsProps> = ({ history, tasks }) => {
  const data = useMemo(() => {
    const taskCounts: Record<TaskId, number> = {
      workout1: 0,
      workout2: 0,
      diet: 0,
      water: 0,
      read: 0,
      photo: 0,
    };

    for (const day of history) {
      for (const taskId in day.tasks) {
        if (day.tasks[taskId as TaskId]) {
          taskCounts[taskId as TaskId]++;
        }
      }
    }

    return tasks.map(task => ({
      name: task.label.split(' ')[0], // Short name for chart
      completed: taskCounts[task.id],
    }));
  }, [history, tasks]);
  
  if (history.length === 0) {
      return <p className="text-center text-medium-text">No data yet. Complete a day to see your stats!</p>
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" allowDecimals={false} />
          <Tooltip 
            cursor={{fill: 'rgba(20, 241, 149, 0.1)'}}
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#F9FAFB' }}
          />
          <Bar dataKey="completed" fill="#14F195" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
