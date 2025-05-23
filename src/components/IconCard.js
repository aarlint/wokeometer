import React from 'react';

const IconCard = ({ icons, isAnti = false, className = "" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center p-0.5 bg-transparent ${className}`}>
      <div className="flex items-center gap-0.5">
        {icons.map((Icon, index) => (
          <Icon key={index} />
        ))}
      </div>
      {isAnti && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-red-500/20 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default IconCard; 