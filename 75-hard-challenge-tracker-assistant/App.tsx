
import React, { useState, useMemo } from 'react';
import { useChallenge } from './hooks/useChallenge';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import DailyCheckin from './components/DailyCheckin';
import Header from './components/Header';
import ChatAssistant from './components/ChatAssistant';
import { TodayIcon, DashboardIcon } from './components/Icons';

type View = 'dashboard' | 'checkin';

export default function App() {
  const { challengeData, startChallenge, addDay, resetChallenge, loading } = useChallenge();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const today = new Date().toDateString();
  const lastEntryDate = useMemo(() => {
    if (challengeData.history.length > 0) {
      return new Date(challengeData.history[challengeData.history.length - 1].date).toDateString();
    }
    return null;
  }, [challengeData.history]);

  const isCheckinDoneForToday = today === lastEntryDate;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-brand-primary text-xl">Loading Challenge...</div>
      </div>
    );
  }

  if (!challengeData.startDate) {
    return <WelcomeScreen onStart={startChallenge} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-light-text font-sans pb-24">
      <Header currentDay={challengeData.currentDay} />
      <main className="container mx-auto p-4 max-w-4xl">
        {currentView === 'dashboard' && (
          <Dashboard challengeData={challengeData} resetChallenge={resetChallenge} />
        )}
        {currentView === 'checkin' && (
          <DailyCheckin
            currentDay={challengeData.currentDay + 1}
            onCompleteDay={addDay}
            onResetChallenge={resetChallenge}
            isCheckinDone={isCheckinDoneForToday}
            tasks={challengeData.customTasks}
          />
        )}
      </main>
      <ChatAssistant challengeData={challengeData} />
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border shadow-lg z-10">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center p-3 w-full transition-colors duration-200 ${
              currentView === 'dashboard' ? 'text-brand-primary' : 'text-medium-text hover:text-light-text'
            }`}
          >
            <DashboardIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('checkin')}
            className={`flex flex-col items-center justify-center p-3 w-full transition-colors duration-200 ${
              currentView === 'checkin' ? 'text-brand-primary' : 'text-medium-text hover:text-light-text'
            }`}
          >
            <TodayIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Daily Check-in</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
