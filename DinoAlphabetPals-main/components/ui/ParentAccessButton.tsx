import React, { useRef } from "react";

interface ParentAccessButtonProps {
  onLongPress: () => void;
}

const ParentAccessButton: React.FC<ParentAccessButtonProps> = ({ onLongPress }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    timeoutRef.current = setTimeout(() => onLongPress(), 3000);
  };
  
  const handleMouseUp = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <button
      className="absolute top-4 right-4 z-30 opacity-20 hover:opacity-70 transition-opacity p-2 rounded-full"
      aria-label="Parent Settings (Hold for 3 seconds)"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <span role="img" aria-label="Settings" style={{ fontSize: 28 }}>⚙️</span>
    </button>
  );
};

export default ParentAccessButton;