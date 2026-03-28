import { Navigate } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import ParticleBackground from "../components/ParticleBackground";
import { useAuth } from "../hooks/useAuth";
import { useGameData } from "../hooks/useGameData";
import { useProfile } from "../hooks/useProfile";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;
  if (!user) return <Navigate to="/" />;

  return (
    <ProfileContent
      username={user.username}
      name={user.name}
      onBack={() => navigate({ to: "/dashboard" })}
    />
  );
}

function ProfileContent({
  username,
  name,
  onBack,
}: { username: string; name: string; onBack: () => void }) {
  const { profile, updateDisplayName, updateAvatar, setFeaturedTool } =
    useProfile(username, name);
  const { gameData } = useGameData(username);
  const [editName, setEditName] = useState(profile.displayName || name);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalLaunches = Object.values(gameData.toolUsage).reduce(
    (s, t) => s + t.count,
    0,
  );
  const toolsExplored = Object.keys(gameData.toolUsage).length;
  const achievementsCount = gameData.unlockedAchievements.length;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string;
      if (b64) updateAvatar(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = () => {
    setSaving(true);
    updateDisplayName(editName);
    setTimeout(() => setSaving(false), 800);
  };

  const stats = [
    { icon: "🚀", label: "Total Launches", value: totalLaunches },
    { icon: "🗺️", label: "Tools Explored", value: `${toolsExplored}/7` },
    { icon: "🏅", label: "Achievements", value: `${achievementsCount}/8` },
    {
      icon: "🔥",
      label: "Current Streak",
      value: `${gameData.currentStreak} day${gameData.currentStreak !== 1 ? "s" : ""}`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-ocid="profile.page">
      <ParticleBackground />
      <main className="flex-1 relative z-10 max-w-2xl mx-auto w-full px-4 py-12">
        {/* Back button */}
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          data-ocid="profile.back_button"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 space-y-8"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {/* Header */}
          <div>
            <h1 className="font-display text-2xl font-bold gradient-text">
              My Profile
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Customise your identity and track your journey
            </p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {profile.avatarBase64 ? (
                <img
                  src={profile.avatarBase64}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                  style={{ border: "2px solid rgba(0,240,255,0.4)" }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full btn-gradient flex items-center justify-center text-2xl font-bold text-white select-none">
                  {getInitials(profile.displayName || name)}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="profile.upload_button"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full glass-card border border-white/20 flex items-center justify-center hover:bg-white/15 transition-colors"
                aria-label="Upload photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="profile.secondary_button"
                className="text-xs px-4 py-2 rounded-xl glass-card border border-white/15 hover:bg-white/10 transition-colors"
              >
                Upload Photo
              </button>
              {profile.avatarBase64 && (
                <button
                  type="button"
                  onClick={() => updateAvatar("")}
                  data-ocid="profile.delete_button"
                  className="text-xs px-4 py-2 rounded-xl glass-card border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          </div>

          {/* Display name */}
          <div className="space-y-2">
            <label
              htmlFor="display-name"
              className="text-sm font-medium text-foreground"
            >
              Display Name
            </label>
            <div className="flex gap-2">
              <input
                id="display-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                data-ocid="profile.input"
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Your name"
              />
              <button
                type="button"
                onClick={handleSaveName}
                disabled={
                  !editName.trim() || editName === (profile.displayName || name)
                }
                data-ocid="profile.save_button"
                className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed min-w-[72px]"
              >
                {saving ? "Saved!" : "Save"}
              </button>
            </div>
          </div>

          {/* Stats summary */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Your Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-2xl p-4 text-center"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-display font-bold text-xl text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured tool */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Featured Tool
              </h2>
              {profile.featuredToolId && (
                <button
                  type="button"
                  onClick={() => setFeaturedTool(null)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {profile.featuredToolId
                ? `Tool #${profile.featuredToolId} is featured. You can change this from the dashboard.`
                : "No featured tool set. Star a tool on the dashboard to pin it here."}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
