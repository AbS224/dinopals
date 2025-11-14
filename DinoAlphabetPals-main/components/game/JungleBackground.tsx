import React from "react";

interface JungleBackgroundProps {
  className?: string;
  theme?: "day" | "night" | "sunset" | "winter" | "beach" | "volcano";
  season?: "spring" | "summer" | "fall" | "winter";
}

export const JungleBackground: React.FC<JungleBackgroundProps> = ({ 
  className = "",
  theme = "day",
  season = "summer"
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case "night":
        return {
          sky: "url(#nightSkyGradient)",
          ground: "#2d5a3d",
          trees: "#1f4a2e",
          accent: "#4a90e2"
        };
      case "sunset":
        return {
          sky: "url(#sunsetSkyGradient)",
          ground: "#8b5a3c",
          trees: "#654321",
          accent: "#ff6b35"
        };
      case "winter":
        return {
          sky: "url(#winterSkyGradient)",
          ground: "#e5f3ff",
          trees: "#2d5a3d",
          accent: "#87ceeb"
        };
      case "beach":
        return {
          sky: "url(#beachSkyGradient)",
          ground: "#f4e4bc",
          trees: "#228b22",
          accent: "#00bfff"
        };
      case "volcano":
        return {
          sky: "url(#volcanoSkyGradient)",
          ground: "#8b4513",
          trees: "#654321",
          accent: "#ff4500"
        };
      default:
        return {
          sky: "url(#skyGradient)",
          ground: "#93f3a2",
          trees: "#43bc6a",
          accent: "#68d9fc"
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className={`absolute inset-0 w-full h-full z-0 ${className}`}>
      <svg
        viewBox="0 0 1200 800"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMax slice"
        aria-label="Cartoon Jungle Background"
      >
        {/* Sky gradients */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:"#87CEEB", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#caf0fc", stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="nightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:"#191970", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#483d8b", stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="sunsetSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:"#ff6b35", stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:"#f7931e", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#ffdc00", stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="winterSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:"#e6f3ff", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#b3d9ff", stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="beachSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:"#87ceeb", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#e0f6ff", stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="volcanoSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:"#8b0000", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#ff4500", stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        <rect width="1200" height="800" fill={colors.sky} />
        
        {/* Distant volcano */}
        <ellipse cx="1000" cy="650" rx="110" ry="90" fill="#7e6f56"/>
        <polygon points="940,640 1000,500 1060,640" fill="#d7a972"/>
        {/* Lava glow */}
        <ellipse cx="1000" cy="550" rx="22" ry="7" fill="#ff604d"/>
        
        {/* Waterfall */}
        <rect x="140" y="450" width="60" height="150" rx="22" fill={colors.accent} opacity="0.7"/>
        <rect x="150" y="460" width="40" height="140" rx="15" fill="#a8e6fd" opacity="0.5"/>
        
        {/* Ground layers */}
        <ellipse cx="600" cy="740" rx="620" ry="120" fill={colors.ground} />
        <ellipse cx="600" cy="760" rx="580" ry="80" fill={adjustBrightness(colors.ground, 10)} />
        
        {/* Foreground vegetation */}
        <ellipse cx="280" cy="700" rx="130" ry="80" fill={colors.trees}/>
        <ellipse cx="600" cy="740" rx="170" ry="60" fill={adjustBrightness(colors.trees, 15)} />
        <ellipse cx="900" cy="770" rx="110" ry="40" fill={adjustBrightness(colors.trees, 15)} />
        
        {/* Palm tree */}
        <rect x="230" y="400" width="18" height="180" rx="9" fill="#d1a363"/>
        <ellipse cx="239" cy="410" rx="70" ry="18" fill="#6ed65b" />
        <ellipse cx="180" cy="430" rx="45" ry="13" fill="#82ed82"/>
        <ellipse cx="280" cy="440" rx="36" ry="11" fill="#6ed65b"/>
        
        {/* Other trees */}
        <rect x="100" y="500" width="20" height="180" rx="10" fill="#b38b5a"/>
        <rect x="1050" y="520" width="24" height="200" rx="12" fill="#8e6a3a"/>
        <ellipse cx="110" cy="500" rx="60" ry="28" fill="#68d67d"/>
        <ellipse cx="1062" cy="520" rx="72" ry="32" fill="#5bcd6a"/>
        
        {/* Decorative vines */}
        <path d="M 380 200 Q 350 300 410 360 Q 470 420 370 520" stroke="#51bc6e" strokeWidth="9" fill="none"/>
        <path d="M 750 180 Q 720 280 780 340 Q 840 400 740 500" stroke="#5bcd6a" strokeWidth="7" fill="none"/>
        
        {/* Happy sun or moon */}
        {theme === "night" ? (
          <ellipse cx="1100" cy="100" rx="35" ry="33" fill="#f0f8ff" />
        ) : (
          <ellipse cx="1100" cy="100" rx="40" ry="38" fill="#fff799" />
        )}
        
        {/* Weather effects */}
        {theme === "winter" && (
          <>
            {/* Snowflakes */}
            <circle cx="200" cy="150" r="3" fill="white" opacity="0.8" />
            <circle cx="400" cy="200" r="2" fill="white" opacity="0.9" />
            <circle cx="600" cy="120" r="3" fill="white" opacity="0.7" />
            <circle cx="800" cy="180" r="2" fill="white" opacity="0.8" />
            <circle cx="1000" cy="140" r="3" fill="white" opacity="0.9" />
          </>
        )}
        
        {/* Fluffy clouds */}
        <ellipse cx="1000" cy="150" rx="80" ry="25" fill="#f2f6fc" opacity="0.8"/>
        <ellipse cx="210" cy="120" rx="60" ry="18" fill="#f2f6fc" opacity="0.8"/>
        <ellipse cx="500" cy="180" rx="50" ry="15" fill="#f2f6fc" opacity="0.6"/>
        
        {/* Flowers and details */}
        <circle cx="320" cy="680" r="8" fill="#ff6b9d"/>
        <circle cx="520" cy="720" r="6" fill="#ffd93d"/>
        <circle cx="720" cy="700" r="7" fill="#ff6b9d"/>
        
        {/* Butterflies */}
        <ellipse cx="400" cy="300" rx="4" ry="2" fill="#ff6b9d" opacity="0.8"/>
        <ellipse cx="600" cy="250" rx="3" ry="2" fill="#6c5ce7" opacity="0.8"/>
      </svg>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustBrightness(color: string, percent: number): string {
  if (color.startsWith('#')) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
  return color;
}

export default JungleBackground;