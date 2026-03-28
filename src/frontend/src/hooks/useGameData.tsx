import { useCallback, useEffect, useRef, useState } from "react";

export interface ToolUsageEntry {
  count: number;
  lastUsed: string;
}

export interface ActivityEntry {
  toolId: number;
  toolName: string;
  toolEmoji: string;
  timestamp: string;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  toolId?: number;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "tool-1",
    name: "Study Pioneer",
    description: "Launched Smart Study AI",
    emoji: "📚",
    toolId: 1,
  },
  {
    id: "tool-2",
    name: "Career Starter",
    description: "Launched AI Career Guidance",
    emoji: "🎯",
    toolId: 2,
  },
  {
    id: "tool-3",
    name: "Mentee",
    description: "Launched Mentor AI",
    emoji: "👥",
    toolId: 3,
  },
  {
    id: "tool-4",
    name: "Knowledge Seeker",
    description: "Launched Instant Knowledge",
    emoji: "⚡",
    toolId: 4,
  },
  {
    id: "tool-5",
    name: "Master Chef",
    description: "Launched AI Personal Chef",
    emoji: "🍳",
    toolId: 5,
  },
  {
    id: "tool-6",
    name: "Health Guardian",
    description: "Launched Medical Diagnosis",
    emoji: "🧬",
    toolId: 6,
  },
  {
    id: "tool-7",
    name: "Creative Mind",
    description: "Launched Creative AI Studio",
    emoji: "🎨",
    toolId: 7,
  },
  {
    id: "hub-master",
    name: "Hub Master",
    description: "Used all 7 AI tools",
    emoji: "🏆",
  },
];

export interface GameData {
  toolUsage: Record<number, ToolUsageEntry>;
  activityLog: ActivityEntry[];
  unlockedAchievements: string[];
  currentStreak: number;
  lastActivityDate: string;
}

const EMPTY_GAME_DATA: GameData = {
  toolUsage: {},
  activityLog: [],
  unlockedAchievements: [],
  currentStreak: 0,
  lastActivityDate: "",
};

function loadGameData(username: string): GameData {
  try {
    const raw = localStorage.getItem(`intellihub-gamedata-${username}`);
    if (!raw) return { ...EMPTY_GAME_DATA };
    const parsed = JSON.parse(raw) as GameData;
    return {
      ...EMPTY_GAME_DATA,
      ...parsed,
    };
  } catch {
    return { ...EMPTY_GAME_DATA };
  }
}

function saveGameData(username: string, data: GameData) {
  localStorage.setItem(`intellihub-gamedata-${username}`, JSON.stringify(data));
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function useGameData(username: string) {
  const [gameData, setGameData] = useState<GameData>(() =>
    loadGameData(username),
  );
  const [newAchievement, setNewAchievement] = useState<AchievementDef | null>(
    null,
  );
  const usernameRef = useRef(username);
  usernameRef.current = username;

  useEffect(() => {
    setGameData(loadGameData(username));
  }, [username]);

  const logToolLaunch = useCallback(
    (toolId: number, toolName: string, toolEmoji: string) => {
      setGameData((prev) => {
        const now = new Date().toISOString();
        const today = now.slice(0, 10);
        const existing = prev.toolUsage[toolId];
        const toolUsage: Record<number, ToolUsageEntry> = {
          ...prev.toolUsage,
          [toolId]: { count: (existing?.count ?? 0) + 1, lastUsed: now },
        };

        const newEntry: ActivityEntry = {
          toolId,
          toolName,
          toolEmoji,
          timestamp: now,
        };
        const activityLog = [newEntry, ...prev.activityLog].slice(0, 10);

        // Streak calculation
        let currentStreak = prev.currentStreak;
        const lastDate = prev.lastActivityDate;
        if (lastDate === today) {
          // same day, no change
        } else if (lastDate === getYesterday()) {
          currentStreak = currentStreak + 1;
        } else {
          currentStreak = 1;
        }
        const lastActivityDate = today;

        const unlockedAchievements = [...prev.unlockedAchievements];
        let justUnlocked: AchievementDef | null = null;

        const toolAchId = `tool-${toolId}`;
        if (!unlockedAchievements.includes(toolAchId)) {
          unlockedAchievements.push(toolAchId);
          justUnlocked =
            ACHIEVEMENT_DEFS.find((a) => a.id === toolAchId) ?? null;
        }

        const allToolIds = [1, 2, 3, 4, 5, 6, 7];
        const usedToolIds = Object.keys(toolUsage).map(Number);
        const allUsed = allToolIds.every((id) => usedToolIds.includes(id));
        if (allUsed && !unlockedAchievements.includes("hub-master")) {
          unlockedAchievements.push("hub-master");
          if (!justUnlocked)
            justUnlocked =
              ACHIEVEMENT_DEFS.find((a) => a.id === "hub-master") ?? null;
        }

        if (justUnlocked) setNewAchievement(justUnlocked);

        const next: GameData = {
          toolUsage,
          activityLog,
          unlockedAchievements,
          currentStreak,
          lastActivityDate,
        };
        saveGameData(usernameRef.current, next);
        return next;
      });
    },
    [],
  );

  const clearNewAchievement = useCallback(() => setNewAchievement(null), []);

  return { gameData, logToolLaunch, newAchievement, clearNewAchievement };
}
