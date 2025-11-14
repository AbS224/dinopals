"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressGrid from "@/features/parent-dashboard/components/ProgressGrid";
import SettingsSlider from "@/features/parent-dashboard/components/SettingsSlider";
import { useParentStore } from "@/store/parentStore";
import { AuthManager } from "@/lib/auth";

const ParentDashboard: React.FC = () => {
  const fetchProgress = useParentStore((s) => s.fetchProgress);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!AuthManager.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    fetchProgress();
  }, [fetchProgress, router]);

  const handleLogout = () => {
    AuthManager.clearAuth();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">
            📊 Parent Dashboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
            >
              ← Back to Game
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            🎯 Jeffrey's Progress
          </h2>
          <ProgressGrid />
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            ⚙️ Settings
          </h2>
          <SettingsSlider />
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Made with 💚 for Jeffrey from Uncle Adam
          </p>
          <p className="text-xs mt-2">
            Safe, educational, and always encouraging!
          </p>
        </div>
      </div>
    </main>
  );
};

export default ParentDashboard;