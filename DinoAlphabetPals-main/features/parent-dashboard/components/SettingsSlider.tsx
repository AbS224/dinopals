import React from "react";
import { useParentStore } from "@/store/parentStore";
import { useAccessibility } from "@/hooks/useAccessibility";
import ErrorLogViewer from "./ErrorLogViewer";
import AIVoiceSettings from "./AIVoiceSettings";

const options = [15, 30, 45, 0]; // 0 = unlimited

const SettingsSlider: React.FC = () => {
  const timeLimit = useParentStore((s) => s.timeLimit);
  const setTimeLimit = useParentStore((s) => s.setTimeLimit);
  const exportProgress = useParentStore((s) => s.exportProgress);
  const resetProgress = useParentStore((s) => s.resetProgress);
  const { settings, updateSetting } = useAccessibility();

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learner-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetProgress();
    }
  };

  return (
    <div className="space-y-8">
      {/* Screen Time Settings */}
      <div>
        <div className="font-semibold text-lg mb-4">📱 Daily Screen Time Limit</div>
        <div className="flex flex-wrap gap-3 mt-2">
          {options.map((min) => (
            <button
              key={min}
              onClick={() => setTimeLimit(min)}
              className={`px-6 py-3 rounded-xl font-bold border-2 shadow-sm transition-all hover:scale-105 ${
                timeLimit === min
                  ? "bg-green-300 border-green-700 text-green-900 scale-105"
                  : "bg-white border-gray-400 text-gray-700 hover:bg-green-50"
              }`}
            >
              {min === 0 ? "Unlimited" : `${min} min`}
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-600 mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <strong>Current setting:</strong>{" "}
          {timeLimit === 0
            ? "No daily limit set."
            : `The learner can play up to ${timeLimit} minutes per day.`}
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          💡 Tip: Balanced screen time helps develop healthy digital habits!
        </div>
      </div>

      {/* AI & Voice Settings */}
      <AIVoiceSettings />

      {/* Accessibility Settings */}
      <div>
        <div className="font-semibold text-lg mb-4">♿ Accessibility Options</div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting("highContrast", e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <div className="font-medium">High Contrast Mode</div>
              <div className="text-sm text-gray-600">Increases color contrast for better visibility</div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={(e) => updateSetting("largeText", e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <div className="font-medium">Large Text</div>
              <div className="text-sm text-gray-600">Makes text bigger and easier to read</div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSetting("reducedMotion", e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <div className="font-medium">Reduced Motion</div>
              <div className="text-sm text-gray-600">Minimizes animations for sensitive users</div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.audioDescriptions}
              onChange={(e) => updateSetting("audioDescriptions", e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <div className="font-medium">Audio Descriptions</div>
              <div className="text-sm text-gray-600">Provides detailed audio descriptions of visual elements</div>
            </div>
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <div className="font-semibold text-lg mb-4">💾 Data Management</div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg"
          >
            📊 Export Progress
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg"
          >
            🔄 Reset Progress
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Export creates a backup file. Reset removes all learning progress.
        </div>
      </div>

      {/* Error Tracking & Monitoring */}
      <ErrorLogViewer />
    </div>
  );
};

export default SettingsSlider;