"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JungleBackground from "@/components/game/JungleBackground";
import DinoCharacter from "@/components/game/DinoCharacter";
import NamePromptModal from "@/components/game/NamePromptModal";
import GamePlayScreen from "@/components/game/GamePlayScreen";
import ParentAccessButton from "@/components/ui/ParentAccessButton";
import PinEntryModal from "@/components/ui/PinEntryModal";
import WelcomeMessage from "@/components/ui/WelcomeMessage";
import { useMicrophone } from "@/hooks/useMicrophone";
import { useDinoVoice } from "@/hooks/useDinoVoice";
import { useGameStore } from "@/store/gameStore";
import { AuthManager } from "@/lib/auth";

const StartScreen: React.FC = () => {
  const { dinoName, gameState, setDinoName, setGameState } = useGameStore();
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { listening, recognizeSpeech } = useMicrophone();
  const { say } = useDinoVoice();
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    if (!AuthManager.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Auto-dismiss welcome message
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlay = () => setShowNamePrompt(true);

  const handleListen = async () => {
    setError(undefined);
    try {
      const name = await recognizeSpeech();
      setDinoName(name);
      setShowNamePrompt(false);
      setGameState("playing");
      // Dino says the name back
      setTimeout(() => {
        say(`What a great name! Nice to meet you, ${name}!`);
      }, 400);
    } catch (err) {
      setError("Hmm, I didn't catch that. Try again!");
    }
  };

  const handleLogout = () => {
    AuthManager.clearAuth();
    router.push('/login');
  };

  if (gameState === "playing") {
    return <GamePlayScreen />;
  }

  return (
    <main className="relative w-screen h-screen bg-cyan-100 overflow-hidden flex items-end justify-center">
      <JungleBackground />
      
      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="absolute top-4 left-4 z-30 bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg text-sm"
      >
        🚪 Logout
      </button>
      
      {/* Dino Character */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-10">
        <DinoCharacter animationState={showNamePrompt ? "talking" : "waving"} />
      </div>
      
      {/* Play Button */}
      <button
        className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-yellow-300 text-2xl font-bold rounded-2xl px-12 py-4 shadow-xl hover:scale-105 transition-all active:scale-95 border-4 border-yellow-400"
        aria-label="Start the Game"
        onClick={handlePlay}
      >
        🎮 Play!
      </button>
      
      {/* Parent Access Button */}
      <ParentAccessButton onLongPress={() => setShowPinModal(true)} />
      
      {/* Dino's Name Greeting */}
      {dinoName && (
        <div className="absolute left-1/2 top-24 -translate-x-1/2 z-20 bg-white/90 rounded-full px-7 py-3 text-xl text-blue-800 shadow-lg border-2 border-blue-200 font-bold animate-bounce-gentle">
          Hi! I'm <span className="text-green-600">{dinoName}</span>!
        </div>
      )}
      
      {/* Welcome Message */}
      {showWelcome && <WelcomeMessage onClose={() => setShowWelcome(false)} />}
      
      {/* Name Prompt Modal */}
      {showNamePrompt && (
        <NamePromptModal
          listening={listening}
          onListen={handleListen}
          onName={setDinoName}
          error={error}
        />
      )}
      
      {/* PIN Entry Modal */}
      {showPinModal && (
        <PinEntryModal
          onSuccess={() => {
            setShowPinModal(false);
            router.push("/parent-dashboard");
          }}
          onClose={() => setShowPinModal(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center border-4 border-red-200 max-w-sm w-full mx-4">
            <div className="text-4xl mb-4">🚪</div>
            <h2 className="text-2xl font-bold mb-4 text-red-800 text-center">
              Logout Confirmation
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to logout? You'll need to sign in again to access the app.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white rounded-xl px-6 py-3 font-bold hover:bg-red-600 transition-colors"
              >
                Yes, Logout
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 rounded-xl px-6 py-3 font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default StartScreen;