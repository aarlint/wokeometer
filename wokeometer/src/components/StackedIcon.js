import React from 'react';
import { FaBan } from 'react-icons/fa';
import IconCard from './IconCard';

const StackedIcon = ({ icon, isAnti = false, className = "" }) => {
  // If icon is an array, use IconCard
  if (Array.isArray(icon)) {
    return <IconCard icons={icon} isAnti={isAnti} className={className} />;
  }

  // If icon is a single component, use it directly
  if (typeof icon === 'function') {
    const Icon = icon;
    if (!isAnti) {
      return <Icon className={className} />;
    }

    return (
      <div className={`relative inline-block ${className}`}>
        <Icon className={className} />
        <FaBan className="absolute inset-0 text-red-500 text-[1.2em]" />
      </div>
    );
  }

  // If icon is undefined or invalid, return null
  return null;
};

export default StackedIcon; 