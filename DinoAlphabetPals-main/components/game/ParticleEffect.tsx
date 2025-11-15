import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

interface ParticleEffectProps {
  x: number;
  y: number;
  type: "confetti" | "sparkles" | "hearts" | "stars";
  active: boolean;
  onComplete?: () => void;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  x, y, type, active, onComplete
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const colors = {
      confetti: ["#ff6b9d", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
      sparkles: ["#ffd700", "#ffed4e", "#fff", "#f1c40f"],
      hearts: ["#ff6b9d", "#e74c3c", "#f39c12"],
      stars: ["#ffd700", "#fff", "#87ceeb"]
    };

    const particleCount = type === "confetti" ? 20 : 10;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random(),
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * -3 - 1
        },
        life: 0,
        maxLife: 60 + Math.random() * 60
      });
    }

    setParticles(newParticles);

    const animate = () => {
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          velocity: {
            x: particle.velocity.x * 0.98,
            y: particle.velocity.y + 0.1
          },
          life: particle.life + 1
        })).filter(particle => particle.life < particle.maxLife);

        if (updated.length === 0 && onComplete) {
          onComplete();
        }

        return updated;
      });
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [active, x, y, type, onComplete]);

  const getParticleShape = (particle: Particle) => {
    switch (type) {
      case "hearts":
        return "💖";
      case "stars":
        return "⭐";
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => {
        const opacity = 1 - (particle.life / particle.maxLife);
        const shape = getParticleShape(particle);
        
        return (
          <div
            key={particle.id}
            className="absolute particle"
            style={{
              left: particle.x,
              top: particle.y,
              opacity,
              transform: `scale(${opacity})`,
            }}
          >
            {shape ? (
              <span style={{ fontSize: particle.size }}>{shape}</span>
            ) : (
              <div
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  borderRadius: type === "sparkles" ? "50%" : "2px",
                  transform: type === "sparkles" ? `rotate(${particle.life * 10}deg)` : "none"
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParticleEffect;