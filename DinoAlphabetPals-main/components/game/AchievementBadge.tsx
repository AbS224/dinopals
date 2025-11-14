import React from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  showProgress?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  showProgress = false
}) => {
  const progressPercentage = achievement.maxProgress 
    ? (achievement.progress || 0) / achievement.maxProgress * 100 
    : 0;

  return (
    <div className={`
      relative p-4 rounded-2xl border-3 transition-all duration-300 hover:scale-105
      ${achievement.unlocked 
        ? "achievement-badge text-yellow-900 shadow-lg" 
        : "bg-gray-200 border-gray-400 text-gray-500"
      }
    `}>
      <div className="text-center">
        <div className="text-3xl mb-2">{achievement.icon}</div>
        <div className="font-bold text-sm mb-1">{achievement.title}</div>
        <div className="text-xs opacity-80">{achievement.description}</div>
        
        {showProgress && achievement.maxProgress && (
          <div className="mt-2">
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs mt-1">
              {achievement.progress || 0} / {achievement.maxProgress}
            </div>
          </div>
        )}
      </div>
      
      {achievement.unlocked && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          ✓
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;