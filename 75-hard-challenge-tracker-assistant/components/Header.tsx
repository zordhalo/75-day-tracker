
import React from 'react';
import { TargetIcon } from './Icons';
import { TOTAL_DAYS } from '../constants';

interface HeaderProps {
  currentDay: number;
}

const Header: React.FC<HeaderProps> = ({ currentDay }) => {
  const progress = Math.round((currentDay / TOTAL_DAYS) * 100);
  
  return (
    <header className="bg-dark-card p-4 shadow-md sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center max-w-4xl">
        <div className="flex items-center space-x-3">
          <TargetIcon className="w-8 h-8 text-brand-primary" />
          <h1 className="text-xl font-bold text-light-text hidden sm:block">75 Hard Tracker</h1>
        </div>
        <div className="text-right">
            <div className="text-sm font-bold text-brand-primary">Day {currentDay} / {TOTAL_DAYS}</div>
            <div className="w-32 bg-dark-border rounded-full h-2.5 mt-1">
                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
