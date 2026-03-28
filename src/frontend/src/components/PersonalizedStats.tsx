import { motion } from "motion/react";
import type { GameData } from "../hooks/useGameData";

interface PersonalizedStatsProps {
  gameData: GameData;
  userName: string;
}

const TOOL_NAMES: Record<number, string> = {
  1: "Medical Diagnosis",
  2: "AI Career Guidance",
  3: "Mentor AI",
  4: "Instant Knowledge",
  5: "AI Personal Chef",
  6: "Creative AI Studio",
  7: "Smart Study AI",
};

const TOOL_EMOJIS: Record<number, string> = {
  1: "🧬",
  2: "🎯",
  3: "👥",
  4: "⚡",
  5: "🍳",
  6: "🎨",
  7: "📚",
};

export default function PersonalizedStats({
  gameData,
  userName,
}: PersonalizedStatsProps) {
  const totalLaunches = Object.values(gameData.toolUsage).reduce(
    (sum, t) => sum + t.count,
    0,
  );
  const uniqueToolsUsed = Object.keys(gameData.toolUsage).length;

  const mostUsedEntry = Object.entries(gameData.toolUsage).sort(
    ([, a], [, b]) => b.count - a.count,
  )[0];
  const mostUsedTool = mostUsedEntry
    ? {
        name: TOOL_NAMES[Number(mostUsedEntry[0])] ?? "Unknown",
        emoji: TOOL_EMOJIS[Number(mostUsedEntry[0])] ?? "🤖",
        count: mostUsedEntry[1].count,
      }
    : null;

  const stats = [
    {
      label: "Total Launches",
      value: totalLaunches,
      sub: "tool sessions",
      icon: "🚀",
    },
    {
      label: "Tools Explored",
      value: `${uniqueToolsUsed}/7`,
      sub: "unique tools",
      icon: "🗺️",
    },
    {
      label: "Achievements",
      value: gameData.unlockedAchievements.length,
      sub: "of 8 unlocked",
      icon: "🏅",
    },
    {
      label: "Favorite Tool",
      value: mostUsedTool ? mostUsedTool.emoji : "—",
      sub: mostUsedTool
        ? `${mostUsedTool.name} (${mostUsedTool.count}×)`
        : "None yet",
      icon: "⭐",
    },
    {
      label: "Current Streak",
      value: gameData.currentStreak,
      sub: "day streak",
      icon: "🔥",
    },
  ];

  return (
    <div data-ocid="stats.section">
      <motion.h2
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="font-display text-xl font-bold gradient-text mb-4"
      >
        Welcome back, {userName.split(" ")[0]}! 👋
      </motion.h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            data-ocid={`stats.item.${i + 1}`}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl text-foreground mb-0.5">
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {stat.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
