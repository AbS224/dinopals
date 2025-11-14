import React from "react";

interface NamePromptModalProps {
  onName: (name: string) => void;
  listening: boolean;
  onListen: () => void;
  error?: string;
}

const NamePromptModal: React.FC<NamePromptModalProps> = ({
  onName,
  listening,
  onListen,
  error,
}) => (
  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center max-w-sm w-full mx-4 border-4 border-blue-200">
      <div className="text-4xl mb-4">🦕</div>
      <span className="text-2xl mb-2 text-blue-700 font-bold text-center">
        Let's Name Your Dino!
      </span>
      <span className="text-lg mb-6 text-gray-700 text-center">
        Tap the mic and say a name:
      </span>
      
      <button
        className={`rounded-full w-20 h-20 flex items-center justify-center text-4xl transition-all mb-4 shadow-lg ${
          listening
            ? "bg-pink-200 animate-pulse border-4 border-pink-400 scale-110"
            : "bg-yellow-200 hover:bg-yellow-300 border-4 border-yellow-400 hover:scale-105"
        }`}
        aria-label="Start Listening"
        disabled={listening}
        onClick={onListen}
      >
        <span role="img" aria-label="microphone">
          🎤
        </span>
      </button>
      
      <div className="text-sm mb-2 h-6 text-gray-700 font-medium">
        {listening ? "🎵 Listening..." : ""}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
      
      <span className="text-xs text-gray-400 mt-6 text-center">
        You can always change it later!
      </span>
    </div>
  </div>
);

export default NamePromptModal;