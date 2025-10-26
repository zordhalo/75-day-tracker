
import React from 'react';
import type { DayData } from '../types';

interface PhotoGalleryProps {
  history: DayData[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ history }) => {
  const photos = history.filter(day => day.photo).reverse();

  if (photos.length === 0) {
    return <p className="text-center text-medium-text">Upload your first progress photo to start your gallery.</p>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
      {photos.map(day => (
        <div key={day.day} className="relative aspect-square group">
          <img
            src={day.photo!}
            alt={`Day ${day.day}`}
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-bold text-lg">Day {day.day}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
