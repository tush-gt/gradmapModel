import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const TeachTooltip = ({ title = "Teach Moment", children, className }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={cn("relative p-4 my-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 flex items-start gap-3 shadow-sm", className)}>
      <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <div className="text-sm opacity-90 leading-relaxed">
          {children}
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-md transition-colors"
        aria-label="Dismiss tooltip"
      >
        <X className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
};
