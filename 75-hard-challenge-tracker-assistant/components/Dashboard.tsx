
import React from 'react';
import type { ChallengeData } from '../types';
import Analytics from './Analytics';
import PhotoGallery from './PhotoGallery';
import { TOTAL_DAYS } from '../constants';
import { ResetIcon } from './Icons';

interface DashboardProps {
  challengeData: ChallengeData;
  resetChallenge: () => void;
}

const MilestoneCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-dark-card p-4 rounded-lg flex items-center space-x-4">
        <div className="bg-dark-border p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-medium-text">{title}</p>
            <p className="text-2xl font-bold text-light-text">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ challengeData, resetChallenge }) => {
  const { currentDay, history } = challengeData;
  const daysRemaining = TOTAL_DAYS - currentDay;

  const getNextMilestone = () => {
    if (currentDay < 25) return 25;
    if (currentDay < 38) return 38; // 50%
    if (currentDay < 50) return 50;
    if (currentDay < 75) return 75;
    return TOTAL_DAYS;
  };
  
  const nextMilestone = getNextMilestone();
  const daysToMilestone = nextMilestone - currentDay;

  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold text-light-text">Your Progress</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MilestoneCard title="Current Streak" value={`${currentDay} Days`} icon={<span className="text-2xl">🔥</span>} />
            <MilestoneCard title="Days Remaining" value={daysRemaining} icon={<span className="text-2xl">⏳</span>} />
            <MilestoneCard title="Next Milestone" value={`${daysToMilestone} days to Day ${nextMilestone}`} icon={<span className="text-2xl">🏆</span>} />
        </div>
      
      {currentDay > 0 ? (
        <>
          <div className="bg-dark-card p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-brand-primary">Task Consistency</h3>
            <Analytics history={history} tasks={challengeData.customTasks} />
          </div>
          <div className="bg-dark-card p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-brand-primary">Progress Gallery</h3>
            <PhotoGallery history={history} />
          </div>
        </>
      ) : (
        <div className="bg-dark-card p-8 rounded-lg text-center">
            <p className="text-medium-text">Your journey is just beginning. Complete Day 1 to start seeing your progress here!</p>
        </div>
      )}

      <div className="pt-4 flex justify-center">
          <button
              onClick={resetChallenge}
              className="flex items-center space-x-2 bg-red-600/20 text-red-400 font-semibold py-2 px-4 rounded-lg hover:bg-red-600/40 transition-colors"
          >
              <ResetIcon className="w-5 h-5" />
              <span>Reset Challenge</span>
          </button>
      </div>

    </div>
  );
};

export default Dashboard;
