import React from "react";

type DinoAnimation = "idle" | "waving" | "talking" | "reaching" | "chomping" | "dancing" | "celebrating";

interface DinoCharacterProps {
  animationState?: DinoAnimation;
  neckTarget?: { x: number; y: number } | null;
  className?: string;
  dinoColor?: string;
  accessoryType?: "none" | "hat" | "bow" | "glasses";
}

export const DinoCharacter: React.FC<DinoCharacterProps> = ({
  animationState = "idle",
  neckTarget = null,
  className = "",
  dinoColor = "#82d4f7",
  accessoryType = "none",
}) => {
  // Calculate neck transform if needed
  let neckTransform = "";
  if (neckTarget) {
    const dx = neckTarget.x - 120;
    const dy = neckTarget.y - 80;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) * 0.3; // Reduced rotation
    neckTransform = `rotate(${angle}deg)`;
  }

  const getAnimation = () => {
    switch (animationState) {
      case "waving":
        return "animate-wiggle";
      case "talking":
        return "animate-talk";
      case "reaching":
        return "animate-reach";
      case "chomping":
        return "animate-chomp";
      case "dancing":
        return "animate-happy-dance";
      case "celebrating":
        return "animate-bounce-gentle";
      default:
        return "animate-bounce-gentle";
    }
  };

  const getDinoColors = () => {
    const baseColor = dinoColor;
    const shadeColor = dinoColor === "#82d4f7" ? "#5cb8e2" : adjustBrightness(dinoColor, -20);
    const darkColor = dinoColor === "#82d4f7" ? "#499dbd" : adjustBrightness(dinoColor, -40);
    const lightColor = adjustBrightness(dinoColor, 20);
    return { baseColor, shadeColor, darkColor, lightColor };
  };

  const { baseColor, shadeColor, darkColor, lightColor } = getDinoColors();

  const renderAccessory = () => {
    switch (accessoryType) {
      case "hat":
        return (
          <g>
            <ellipse cx="120" cy="45" rx="25" ry="8" fill="#dc2626" />
            <rect x="105" y="35" width="30" height="15" rx="15" fill="#dc2626" />
          </g>
        );
      case "bow":
        return (
          <g>
            <path d="M100 55 Q110 45 120 55 Q130 45 140 55 Q130 65 120 55 Q110 65 100 55" fill="#ec4899" />
            <circle cx="120" cy="55" r="3" fill="#be185d" />
          </g>
        );
      case "glasses":
        return (
          <g>
            <circle cx="115" cy="62" r="12" fill="none" stroke="#374151" strokeWidth="2" />
            <circle cx="135" cy="62" r="12" fill="none" stroke="#374151" strokeWidth="2" />
            <line x1="127" y1="62" x2="123" y2="62" stroke="#374151" strokeWidth="2" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex justify-center items-end select-none ${className}`}>
      <svg
        viewBox="0 0 240 300"
        width="220"
        height="270"
        className={`transition-all duration-700 drop-shadow-xl ${getAnimation()}`}
        aria-label="Friendly Cartoon Brachiosaurus"
      >
        {/* Main Body - Rounded and friendly */}
        <ellipse cx="120" cy="220" rx="65" ry="35" fill={baseColor} stroke={darkColor} strokeWidth="3"/>
        
        {/* Body highlight for dimension */}
        <ellipse cx="115" cy="210" rx="45" ry="25" fill={lightColor} opacity="0.6"/>
        
        {/* Back legs - Sturdy and well-proportioned */}
        <ellipse cx="95" cy="245" rx="12" ry="25" fill={shadeColor} stroke={darkColor} strokeWidth="2"/>
        <ellipse cx="145" cy="245" rx="12" ry="25" fill={shadeColor} stroke={darkColor} strokeWidth="2"/>
        
        {/* Front legs - Slightly forward */}
        <ellipse cx="85" cy="235" rx="10" ry="20" fill={shadeColor} stroke={darkColor} strokeWidth="2"/>
        <ellipse cx="155" cy="235" rx="10" ry="20" fill={shadeColor} stroke={darkColor} strokeWidth="2"/>
        
        {/* Feet */}
        <ellipse cx="95" cy="265" rx="15" ry="8" fill={darkColor}/>
        <ellipse cx="145" cy="265" rx="15" ry="8" fill={darkColor}/>
        <ellipse cx="85" cy="250" rx="12" ry="6" fill={darkColor}/>
        <ellipse cx="155" cy="250" rx="12" ry="6" fill={darkColor}/>
        
        {/* Tail - Curved and friendly */}
        <path d="M55 230 Q25 225 35 205 Q45 215 55 220 Q65 225 55 230" fill={baseColor} stroke={darkColor} strokeWidth="3"/>
        <path d="M45 220 Q35 215 40 210" fill={lightColor} opacity="0.6"/>
        
        {/* Neck - Animated group, more proportional */}
        <g style={{ transformOrigin: "120px 180px", transform: neckTransform, transition: "transform 0.7s cubic-bezier(.25,.6,.45,1.3)" }}>
          {/* Neck - Wider and more natural */}
          <ellipse cx="120" cy="150" rx="20" ry="45" fill={baseColor} stroke={darkColor} strokeWidth="3"/>
          <ellipse cx="115" cy="140" rx="12" ry="30" fill={lightColor} opacity="0.6"/>
          
          {/* Head - Larger and more proportional */}
          <ellipse cx="120" cy="85" rx="35" ry="32" fill={baseColor} stroke={darkColor} strokeWidth="3"/>
          <ellipse cx="115" cy="80" rx="25" ry="22" fill={lightColor} opacity="0.6"/>
          
          {/* Snout - Rounded and friendly */}
          <ellipse cx="140" cy="90" rx="18" ry="15" fill={baseColor} stroke={darkColor} strokeWidth="3"/>
          <ellipse cx="138" cy="88" rx="12" ry="10" fill={lightColor} opacity="0.6"/>
          
          {/* Eyes - Large and friendly */}
          <ellipse cx="115" cy="75" rx="8" ry="10" fill="white" stroke={darkColor} strokeWidth="2"/>
          <ellipse cx="115" cy="75" rx="5" ry="7" fill="#2d3748"/>
          <ellipse cx="117" cy="72" rx="2" ry="3" fill="white"/>
          
          {/* Second eye (slight perspective) */}
          <ellipse cx="130" cy="78" rx="6" ry="8" fill="white" stroke={darkColor} strokeWidth="2"/>
          <ellipse cx="130" cy="78" rx="3" ry="5" fill="#2d3748"/>
          <ellipse cx="131" cy="76" rx="1" ry="2" fill="white"/>
          
          {/* Nostrils - Small and cute */}
          <ellipse cx="148" cy="88" rx="2" ry="3" fill={darkColor} opacity="0.7"/>
          <ellipse cx="148" cy="94" rx="2" ry="3" fill={darkColor} opacity="0.7"/>
          
          {/* Smile - Always happy */}
          <path d="M125 100 Q135 108 145 100" stroke={darkColor} strokeWidth="3" fill="none" strokeLinecap="round"/>
          
          {/* Cheek blush - Adds cuteness */}
          <ellipse cx="95" cy="85" rx="6" ry="4" fill="#ff9999" opacity="0.6"/>
          <ellipse cx="155" cy="88" rx="5" ry="3" fill="#ff9999" opacity="0.6"/>
          
          {/* Head spikes - Small and friendly */}
          <ellipse cx="105" cy="60" rx="4" ry="8" fill={shadeColor} stroke={darkColor} strokeWidth="2"/>
          <ellipse cx="120" cy="55" rx="5" ry="10" fill={shadeColor} stroke={darkColor} strokeWidth="2"/>
          <ellipse cx="135" cy="60" rx="4" ry="8" fill={shadeColor} stroke={darkColor} strokeWidth="2"/>
          
          {/* Accessory */}
          {renderAccessory()}
        </g>
        
        {/* Body spots for extra cuteness */}
        <ellipse cx="100" cy="215" rx="8" ry="6" fill={shadeColor} opacity="0.8"/>
        <ellipse cx="140" cy="205" rx="6" ry="4" fill={shadeColor} opacity="0.6"/>
        <ellipse cx="125" cy="235" rx="5" ry="3" fill={shadeColor} opacity="0.7"/>
        
        {/* Belly highlight */}
        <ellipse cx="120" cy="240" rx="35" ry="15" fill={lightColor} opacity="0.4"/>
      </svg>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

export default DinoCharacter;