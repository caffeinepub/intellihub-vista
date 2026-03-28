import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ACHIEVEMENT_DEFS } from "../hooks/useGameData";

interface AchievementsPanelProps {
  unlockedAchievements: string[];
}

export default function AchievementsPanel({
  unlockedAchievements,
}: AchievementsPanelProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);

  const handleShareAsImage = async () => {
    if (!gridRef.current || copying) return;
    setCopying(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: "#0a0a0f",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to generate image");
          setCopying(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast.success("Achievements copied to clipboard!");
        } catch {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "intellihub-achievements.png";
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Achievements image downloaded!");
        }
        setCopying(false);
      }, "image/png");
    } catch {
      toast.error("Could not capture achievements");
      setCopying(false);
    }
  };

  return (
    <div data-ocid="achievements.section">
      <div className="flex items-center justify-between mb-4">
        <motion.h2
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-display text-xl font-bold gradient-text"
        >
          Achievements
        </motion.h2>
        <button
          type="button"
          onClick={handleShareAsImage}
          disabled={copying}
          data-ocid="achievements.secondary_button"
          className="text-xs px-3 py-1.5 rounded-xl glass-card border border-white/15 hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {copying ? (
            <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            "📋"
          )}
          {copying ? "Copying…" : "Share as Image"}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" ref={gridRef}>
        {ACHIEVEMENT_DEFS.map((ach, i) => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              data-ocid={`achievements.item.${i + 1}`}
              className="glass-card rounded-2xl p-4 text-center relative overflow-hidden"
              style={{
                filter: isUnlocked ? "none" : "grayscale(1) opacity(0.5)",
                boxShadow: isUnlocked
                  ? ach.id === "hub-master"
                    ? "0 0 20px rgba(255,215,0,0.3)"
                    : "0 0 16px rgba(0,240,255,0.15)"
                  : "none",
                border:
                  isUnlocked && ach.id === "hub-master"
                    ? "1px solid rgba(255,215,0,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: i * 0.05,
                  }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                  style={{
                    background: "linear-gradient(135deg,#00F0FF,#8A2BE2)",
                  }}
                >
                  ✓
                </motion.div>
              )}
              <div className="text-3xl mb-2" aria-hidden="true">
                {ach.emoji}
              </div>
              <div className="font-display font-bold text-xs text-foreground mb-1">
                {isUnlocked ? ach.name : "???"}
              </div>
              <div className="text-[10px] text-muted-foreground leading-snug">
                {isUnlocked ? ach.description : "Keep exploring to unlock"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
