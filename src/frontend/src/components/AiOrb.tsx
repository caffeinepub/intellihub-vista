import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";

interface Tool {
  id: number;
  name: string;
  emoji: string;
  description: string;
  url: string;
  featured?: boolean;
}

interface AiOrbProps {
  tools: Tool[];
  onToolLaunch: (toolId: number, toolName: string, toolEmoji: string) => void;
}

const ORBIT_RADIUS = 230;

export default function AiOrb({ tools, onToolLaunch }: AiOrbProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const handleLaunch = (tool: Tool) => {
    onToolLaunch(tool.id, tool.name, tool.emoji);
    window.open(tool.url, "_blank", "noopener,noreferrer");
  };

  if (isMobile) {
    return (
      <div className="w-full px-4" data-ocid="orb.section">
        {/* Mini orb */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full orb-glow" />
            <div className="absolute inset-2 rounded-full orb-core flex items-center justify-center">
              <img
                src="/assets/uploads/Hexagonal-Neural-Hub-Icon-with-Vibrant-Colors_20260307_184744_0000-2-1.png"
                alt="AI Core"
                className="w-14 h-14 object-contain logo-pulse"
              />
            </div>
          </div>
        </div>

        {/* Grid of tool cards */}
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => handleLaunch(tool)}
              data-ocid={`tools.item.${tool.id}`}
              className="glass-card rounded-2xl p-4 text-left card-hover relative group"
            >
              {tool.featured && (
                <span
                  className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    color: "#000",
                  }}
                >
                  ★
                </span>
              )}
              <div className="text-2xl mb-2">{tool.emoji}</div>
              <div className="font-display font-bold text-sm text-foreground mb-1 leading-tight">
                {tool.name}
              </div>
              <div className="text-muted-foreground text-xs leading-snug line-clamp-2">
                {tool.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 600, height: 600 }}
      data-ocid="orb.section"
    >
      {/* Orbit ring decoration */}
      <div
        className="absolute rounded-full border border-white/5"
        style={{
          width: ORBIT_RADIUS * 2 + 110,
          height: ORBIT_RADIUS * 2 + 110,
        }}
      />
      <div
        className="absolute rounded-full border border-white/10"
        style={{ width: ORBIT_RADIUS * 2 + 60, height: ORBIT_RADIUS * 2 + 60 }}
      />

      {/* Orbiting tool cards */}
      <div
        className="absolute inset-0 flex items-center justify-center orbit-ring"
        style={{ animationPlayState: isPaused ? "paused" : "running" }}
      >
        {tools.map((tool, i) => {
          const angle = (i / tools.length) * 360;
          const isHovered = hoveredId === tool.id;
          return (
            <div
              key={tool.id}
              className="absolute orbit-slot"
              style={{
                transform: `rotate(${angle}deg) translateX(${ORBIT_RADIUS}px)`,
              }}
            >
              <div
                className="orbit-card-inner"
                style={{
                  animationPlayState: isPaused ? "paused" : "running",
                  transform: `rotate(-${angle}deg)`,
                }}
              >
                <motion.button
                  type="button"
                  onClick={() => handleLaunch(tool)}
                  onHoverStart={() => {
                    setIsPaused(true);
                    setHoveredId(tool.id);
                  }}
                  onHoverEnd={() => {
                    setIsPaused(false);
                    setHoveredId(null);
                  }}
                  data-ocid={`tools.item.${tool.id}`}
                  animate={{ scale: isHovered ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative glass-card rounded-2xl p-3 text-center cursor-pointer"
                  style={{
                    width: 110,
                    boxShadow: isHovered
                      ? `0 0 24px ${tool.featured ? "rgba(255,215,0,0.5)" : "rgba(0,240,255,0.4)"}, 0 0 48px rgba(138,43,226,0.2)`
                      : tool.featured
                        ? "0 0 16px rgba(255,215,0,0.25)"
                        : "none",
                    border: tool.featured
                      ? "1px solid rgba(255,215,0,0.4)"
                      : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {tool.featured && (
                    <span
                      className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10"
                      style={{
                        background: "linear-gradient(135deg,#FFD700,#FFA500)",
                        color: "#000",
                      }}
                    >
                      ★ Featured
                    </span>
                  )}
                  <div className="text-2xl mb-1.5">{tool.emoji}</div>
                  <div className="font-display font-bold text-xs text-foreground mb-1 leading-tight">
                    {tool.name}
                  </div>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 flex items-center justify-center gap-1 text-[10px] font-semibold"
                      style={{ color: "#00F0FF" }}
                    >
                      Open <ExternalLink className="w-2.5 h-2.5" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Central orb */}
      <div className="relative z-10 w-44 h-44 flex items-center justify-center">
        {/* Outer glow rings */}
        <div className="absolute inset-0 rounded-full orb-ring-1" />
        <div className="absolute inset-4 rounded-full orb-ring-2" />
        {/* Core */}
        <div className="absolute inset-8 rounded-full orb-core flex items-center justify-center">
          <img
            src="/assets/uploads/Hexagonal-Neural-Hub-Icon-with-Vibrant-Colors_20260307_184744_0000-2-1.png"
            alt="IntelliHub Vista AI Core"
            className="w-20 h-20 object-contain logo-pulse"
          />
        </div>
      </div>
    </div>
  );
}
