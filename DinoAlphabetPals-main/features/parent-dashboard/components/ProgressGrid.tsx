import React from "react";
import { useParentStore } from "@/store/parentStore";

const colorMap = {
  "not-practiced": "bg-gray-200 border-gray-400 text-gray-500",
  "in-progress": "bg-yellow-200 border-yellow-500 text-yellow-800",
  "mastered": "bg-green-300 border-green-600 text-green-900",
};

const statusLabels = {
  "not-practiced": "Not Started",
  "in-progress": "Learning",
  "mastered": "Mastered ✓",
};

const ProgressGrid: React.FC = () => {
  const progressData = useParentStore((s) => s.progressData);
  const analytics = useParentStore((s) => s.analytics);
  
  const stats = Object.values(progressData).reduce((acc, status) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completionPercentage = Math.round((stats.mastered || 0) / 26 * 100);

  return (
    <div>
      {/* Overall Progress */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-blue-800">Overall Progress</h3>
          <div className="text-3xl font-bold text-green-600">{completionPercentage}%</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-sm text-gray-600">
          {stats.mastered || 0} of 26 letters mastered
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl text-center border-2 border-green-200">
          <div className="text-2xl font-bold text-green-700">{stats.mastered || 0}</div>
          <div className="text-sm text-green-600">Mastered</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl text-center border-2 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">{stats["in-progress"] || 0}</div>
          <div className="text-sm text-yellow-600">Learning</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl text-center border-2 border-gray-200">
          <div className="text-2xl font-bold text-gray-700">{stats["not-practiced"] || 0}</div>
          <div className="text-sm text-gray-600">Not Started</div>
        </div>
      </div>

      {/* Learning Analytics */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
        <h4 className="font-bold text-blue-800 mb-3">Learning Insights</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Total Play Time:</span>
            <div className="text-blue-600">{Math.round(analytics.totalPlayTime / 60)} minutes</div>
          </div>
          <div>
            <span className="font-semibold">Learning Streak:</span>
            <div className="text-green-600">{analytics.learningStreak} days</div>
          </div>
          <div>
            <span className="font-semibold">Sessions:</span>
            <div className="text-purple-600">{analytics.sessionsCompleted}</div>
          </div>
          <div>
            <span className="font-semibold">Avg. Session:</span>
            <div className="text-orange-600">{Math.round(analytics.averageSessionLength)} min</div>
          </div>
        </div>
      </div>

      {/* Letter Grid */}
      <div className="font-semibold text-lg mb-4">Letter Progress</div>
      <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-10">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <div
            key={letter}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 text-xl font-bold transition-all hover:scale-105 cursor-help
              ${colorMap[progressData[letter]]}`}
            title={`${letter}: ${statusLabels[progressData[letter]]}`}
          >
            {letter}
          </div>
        ))}
      </div>
      
      {/* Strongest & Challenging Letters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
          <h4 className="font-bold text-green-800 mb-2">Strongest Letters 💪</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.strongestLetters.slice(0, 8).map(letter => (
              <span key={letter} className="bg-green-200 text-green-800 px-2 py-1 rounded font-bold">
                {letter}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
          <h4 className="font-bold text-orange-800 mb-2">Practice More 📚</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.challengingLetters.slice(0, 8).map(letter => (
              <span key={letter} className="bg-orange-200 text-orange-800 px-2 py-1 rounded font-bold">
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
          <span>Not Started</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></div>
          <span>Learning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-300 border border-green-600 rounded"></div>
          <span>Mastered</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressGrid;