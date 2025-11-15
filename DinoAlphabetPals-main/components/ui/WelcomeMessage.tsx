import React from "react";

interface WelcomeMessageProps {
  onClose: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl px-12 py-12 shadow-2xl flex flex-col items-center border-4 border-green-300 animate-bounce-gentle cursor-pointer"
        onClick={onClose}
      >
        <div className="text-3xl font-bold mb-3 text-blue-800">
          Hi there! 👋
        </div>
        <div className="text-xl mb-4 text-green-700 font-semibold text-center">
          This game was made with care for young learners! 💚
        </div>
        <div className="text-6xl mb-2">🦕</div>
        <div className="text-sm text-gray-500 text-center">
          Tap anywhere to start your adventure!
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;