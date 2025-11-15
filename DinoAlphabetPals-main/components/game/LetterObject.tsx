import React from "react";

interface LetterObjectProps {
  letter: string;
  x: number;
  y: number;
  onTap: () => void;
  highlighted?: boolean;
  difficulty?: "easy" | "medium" | "hard";
  isUppercase?: boolean;
}

const colors = [
  "bg-pink-200 border-pink-400",
  "bg-green-200 border-green-400", 
  "bg-yellow-200 border-yellow-400",
  "bg-blue-200 border-blue-400",
  "bg-orange-200 border-orange-400",
  "bg-purple-200 border-purple-400",
  "bg-red-200 border-red-400",
  "bg-indigo-200 border-indigo-400"
];

const difficultyStyles = {
  easy: "w-20 h-20 text-5xl",
  medium: "w-16 h-16 text-4xl",
  hard: "w-14 h-14 text-3xl"
};

export const LetterObject: React.FC<LetterObjectProps> = ({
  letter, x, y, onTap, highlighted = false, difficulty = "medium", isUppercase = true
}) => {
  const colorClass = colors[letter.charCodeAt(0) % colors.length];
  const sizeClass = difficultyStyles[difficulty];
  const displayLetter = isUppercase ? letter.toUpperCase() : letter.toLowerCase();
  
  return (
    <button
      style={{ left: x, top: y }}
      className={`absolute rounded-full shadow-lg flex items-center justify-center font-extrabold border-4 transition-all duration-300 select-none hover:scale-110 active:scale-95
        ${colorClass} ${sizeClass}
        ${highlighted ? "ring-4 ring-yellow-300 scale-125 animate-bounce-gentle" : ""}
      `}
      onClick={onTap}
      aria-label={`Letter ${displayLetter}`}
    >
      {displayLetter}
    </button>
  );
};

export default LetterObject;