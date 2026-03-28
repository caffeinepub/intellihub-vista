import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AchievementsPanel from "../components/AchievementsPanel";
import ActivityTimeline from "../components/ActivityTimeline";
import AiChatAssistant from "../components/AiChatAssistant";
import AiOrb from "../components/AiOrb";
import FloatingSidebar from "../components/FloatingSidebar";
import OnboardingTour from "../components/OnboardingTour";
import ParticleBackground from "../components/ParticleBackground";
import PersonalizedStats from "../components/PersonalizedStats";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../hooks/useAuth";
import { useGameData } from "../hooks/useGameData";
import { useProfile } from "../hooks/useProfile";

const TOOLS = [
  {
    id: 1,
    name: "Medical Diagnosis",
    emoji: "🧬",
    description: "Early disease prediction and health monitoring",
    url: "https://html-9bg5j8.onspace.build",
  },
  {
    id: 2,
    name: "AI Career Guidance",
    emoji: "🎯",
    description: "Personalized career path recommendations",
    url: "https://ai-career-guidance-platform-20b.caffeine.xyz",
  },
  {
    id: 3,
    name: "Mentor AI",
    emoji: "👥",
    description: "AI mentors for guidance and knowledge sharing",
    url: "https://react-9b5mk3.onspace.build",
  },
  {
    id: 4,
    name: "Smart Study AI",
    emoji: "📚",
    description: "Intelligent study planning and personalized learning",
    url: "https://smartstudy-ai-cup.caffeine.xyz",
  },
  {
    id: 5,
    name: "Instant Knowledge",
    emoji: "⚡",
    description: "Instant answers on any topic",
    url: "https://react-9bg5ib.onspace.build",
  },
  {
    id: 6,
    name: "AI Personal Chef",
    emoji: "🍳",
    description: "Smart recipe suggestions and meal planning",
    url: "https://ai-personal-chef-tea.caffeine.xyz",
  },
  {
    id: 7,
    name: "Creative AI Studio",
    emoji: "🎨",
    description: "AI-powered tools for art, design, and content",
    url: "https://creative-ai-studio-zy9.caffeine.xyz",
  },
] as const;

type Tool = (typeof TOOLS)[number];

function mobileCardStyle(isFeatured: boolean, isLaunching: boolean) {
  return {
    width: 280,
    flexShrink: 0,
    border: isFeatured
      ? isLaunching
        ? "1px solid rgba(255,215,0,0.7)"
        : "1px solid rgba(255,215,0,0.35)"
      : isLaunching
        ? "1px solid rgba(0,240,255,0.7)"
        : "1px solid rgba(255,255,255,0.08)",
    boxShadow: isLaunching
      ? "0 0 32px rgba(0,240,255,0.5), 0 0 64px rgba(138,43,226,0.3)"
      : undefined,
  };
}

function desktopCardStyle(isFeatured: boolean, isLaunching: boolean) {
  return {
    border: isFeatured
      ? isLaunching
        ? "1px solid rgba(255,215,0,0.7)"
        : "1px solid rgba(255,215,0,0.35)"
      : isLaunching
        ? "1px solid rgba(0,240,255,0.7)"
        : "1px solid rgba(255,255,255,0.08)",
    boxShadow: isLaunching
      ? "0 0 32px rgba(0,240,255,0.5), 0 0 64px rgba(138,43,226,0.3)"
      : undefined,
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [launchingId, setLaunchingId] = useState<number | null>(null);
  const { gameData, logToolLaunch, newAchievement, clearNewAchievement } =
    useGameData(user?.username ?? "");
  const { profile, markOnboardingDone, setFeaturedTool } = useProfile(
    user?.username ?? "",
    user?.name ?? "",
  );
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
  };

  const handleToolLaunch = (
    toolId: number,
    toolName: string,
    toolEmoji: string,
  ) => {
    logToolLaunch(toolId, toolName, toolEmoji);
  };

  const handleLaunchClick = (tool: Tool) => {
    if (launchingId !== null) return;
    setLaunchingId(tool.id);
    handleToolLaunch(tool.id, tool.name, tool.emoji);
    setTimeout(() => {
      window.open(tool.url, "_blank", "noopener,noreferrer");
      setLaunchingId(null);
    }, 650);
  };

  const handleStarClick = (toolId: number) => {
    if (profile.featuredToolId === toolId) {
      setFeaturedTool(null);
      toast("Featured tool removed");
    } else {
      setFeaturedTool(toolId);
      toast.success("⭐ Featured tool updated!");
    }
  };

  useEffect(() => {
    if (newAchievement) {
      toast.success(`🏆 Achievement Unlocked: ${newAchievement.name}`, {
        description: newAchievement.description,
        duration: 4000,
      });
      clearNewAchievement();
    }
  }, [newAchievement, clearNewAchievement]);

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  const lastUsedTool =
    gameData.activityLog[gameData.activityLog.length - 1]?.toolName ?? null;

  return (
    <div className="min-h-screen flex">
      <ParticleBackground />

      {/* Onboarding Tour */}
      <OnboardingTour
        profile={profile}
        markOnboardingDone={markOnboardingDone}
      />

      {/* Floating sidebar */}
      <FloatingSidebar
        userName={profile.displayName || user?.name || ""}
        avatarBase64={profile.avatarBase64}
        onLogout={handleLogout}
        onAboutClick={() => setAboutOpen(true)}
      />

      {/* Main content */}
      <main className="flex-1 relative z-10 pl-0 md:pl-20 pb-20 md:pb-0">
        {/* HERO: AI Orb */}
        <section
          id="home"
          className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
          data-ocid="hero.section"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4 glass-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-muted-foreground">7 AI tools ready</span>
            </motion.div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-3">
              <span className="gradient-text">IntelliHub Vista</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Hover over a tool to explore. Click to launch.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <AiOrb
              tools={TOOLS as unknown as Tool[]}
              onToolLaunch={handleToolLaunch}
            />
          </motion.div>

          <motion.button
            type="button"
            onClick={() =>
              document
                .getElementById("tools")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            data-ocid="hero.primary_button"
            className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center gap-1 group"
          >
            <span>Scroll to explore</span>
            <span className="text-lg group-hover:translate-y-1 transition-transform">
              ↓
            </span>
          </motion.button>
        </section>

        {/* TOOLS GRID */}
        <section
          id="tools"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-16"
          data-ocid="tools.section"
        >
          <motion.h2
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-bold gradient-text mb-8"
          >
            All AI Tools
          </motion.h2>

          {isMobile ? (
            /* Mobile: horizontal swipe */
            <div
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4"
              style={{ scrollbarWidth: "none" }}
              data-ocid="tools.list"
            >
              {TOOLS.map((tool) => {
                const isLaunching = launchingId === tool.id;
                const isFeatured = profile.featuredToolId === tool.id;
                return (
                  <motion.div
                    key={tool.id}
                    data-ocid={`tools.item.${tool.id}`}
                    className="glass-card rounded-2xl p-5 relative overflow-hidden group snap-center"
                    animate={{ scale: isLaunching ? 1.03 : 1 }}
                    transition={{ duration: 0.15 }}
                    style={mobileCardStyle(isFeatured, isLaunching)}
                  >
                    <ToolCardContent
                      tool={tool}
                      isFeatured={isFeatured}
                      isLaunching={isLaunching}
                      launchingId={launchingId}
                      handleStarClick={handleStarClick}
                      handleLaunchClick={handleLaunchClick}
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Desktop: grid */
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.07 } },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              data-ocid="tools.list"
            >
              {TOOLS.map((tool) => {
                const isLaunching = launchingId === tool.id;
                const isFeatured = profile.featuredToolId === tool.id;
                return (
                  <motion.div
                    key={tool.id}
                    variants={cardVariants}
                    data-ocid={`tools.item.${tool.id}`}
                    className="glass-card rounded-2xl p-5 card-hover relative overflow-hidden group"
                    animate={{ scale: isLaunching ? 1.03 : 1 }}
                    transition={{ duration: 0.15 }}
                    style={desktopCardStyle(isFeatured, isLaunching)}
                  >
                    <ToolCardContent
                      tool={tool}
                      isFeatured={isFeatured}
                      isLaunching={isLaunching}
                      launchingId={launchingId}
                      handleStarClick={handleStarClick}
                      handleLaunchClick={handleLaunchClick}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        {/* DASHBOARD: Stats + Achievements + Activity */}
        <section
          id="dashboard"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-16"
          data-ocid="dashboard.section"
        >
          <div className="space-y-10">
            <PersonalizedStats
              gameData={gameData}
              userName={profile.displayName || user?.name || ""}
            />
            <AchievementsPanel
              unlockedAchievements={gameData.unlockedAchievements}
            />
            <ActivityTimeline activityLog={gameData.activityLog} />
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-16"
          data-ocid="about.section"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-display text-2xl font-bold gradient-text mb-4">
              About IntelliHub Vista
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed max-w-3xl">
              <p>
                IntelliHub Vista is a smart web platform that brings together
                multiple AI-powered applications in one place. Each AI tool is
                designed to solve a specific real-world problem — early disease
                prediction, career guidance, mentorship, instant knowledge
                retrieval, smart study planning, personal chef assistance, and
                creative AI solutions.
              </p>
              <p>
                By integrating these intelligent systems into a single hub,
                IntelliHub Vista provides users with practical,
                technology-driven solutions that improve learning, safety,
                health, sustainability, and efficiency in everyday life.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-semibold">
                Created by
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  "Vishruth Raj. S",
                  "Vasanth. S",
                  "Vigneshwaran. C",
                  "Venkatesan. K",
                ].map((name, i) => (
                  <span
                    key={name}
                    className="text-sm font-medium gradient-text"
                  >
                    {i + 1}. {name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </main>

      {/* About Modal */}
      <AnimatePresence>
        {aboutOpen && (
          <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
            <DialogContent
              data-ocid="about.dialog"
              className="max-w-lg glass-card border-white/10"
            >
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="/assets/uploads/Hexagonal-Neural-Hub-Icon-with-Vibrant-Colors_20260307_184744_0000-2-1.png"
                    alt="IntelliHub Vista"
                    className="w-12 h-12 object-contain logo-pulse"
                  />
                  <DialogTitle className="font-display text-2xl gradient-text">
                    IntelliHub Vista
                  </DialogTitle>
                </div>
              </DialogHeader>
              <div className="mt-2 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  IntelliHub Vista is a smart web platform that brings together
                  multiple AI-powered applications. Think of it as Iron Man's
                  dashboard for intelligence — seven specialized tools unified
                  in one beautiful hub.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Study smarter, advance your career, get mentored, find answers
                  instantly, plan meals, monitor your health, and create with AI
                  — all from a single, premium interface.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setAboutOpen(false)}
                  data-ocid="about.close_button"
                  className="btn-gradient active:scale-95 transition-transform"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* AI Chat Assistant */}
      <AiChatAssistant
        lastUsedTool={lastUsedTool}
        toolUsageCount={gameData.activityLog.length}
      />
    </div>
  );
}

// Extracted tool card content (used in both mobile + desktop)
function ToolCardContent({
  tool,
  isFeatured,
  isLaunching,
  launchingId,
  handleStarClick,
  handleLaunchClick,
}: {
  tool: Tool;
  isFeatured: boolean;
  isLaunching: boolean;
  launchingId: number | null;
  handleStarClick: (id: number) => void;
  handleLaunchClick: (tool: Tool) => void;
}) {
  return (
    <>
      {/* Launch ripple rings */}
      <AnimatePresence>
        {isLaunching && (
          <>
            <motion.div
              key="ring1"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,240,255,0.35) 0%, transparent 70%)",
              }}
            />
            <motion.div
              key="ring2"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(138,43,226,0.3) 0%, transparent 70%)",
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Star / Featured button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleStarClick(tool.id);
        }}
        data-ocid={`tools.toggle.${tool.id}`}
        className="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 rounded-lg hover:bg-white/10"
        aria-label={isFeatured ? "Remove featured" : "Set as featured"}
      >
        <Star
          className="w-4 h-4"
          style={{ color: isFeatured ? "#FFD700" : "rgba(255,255,255,0.5)" }}
          fill={isFeatured ? "#FFD700" : "none"}
        />
      </button>

      {/* Featured badge */}
      {isFeatured && (
        <span
          className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "linear-gradient(135deg,#FFD700,#FFA500)",
            color: "#000",
          }}
        >
          ★ Featured
        </span>
      )}

      <div className="text-3xl mb-3 select-none mt-2">{tool.emoji}</div>
      <h3 className="font-display font-bold text-base mb-1.5 text-foreground">
        {tool.name}
      </h3>
      <p className="text-muted-foreground text-xs leading-relaxed mb-4">
        {tool.description}
      </p>
      <button
        type="button"
        onClick={() => handleLaunchClick(tool)}
        disabled={launchingId !== null}
        data-ocid={`tools.launch.button.${tool.id}`}
        className="inline-flex items-center gap-2 w-full justify-center px-3 py-2 rounded-xl text-xs font-semibold btn-gradient active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLaunching ? (
          <>
            <span className="animate-pulse">Launching…</span>
            <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          </>
        ) : (
          <>
            Launch <ExternalLink className="w-3 h-3" />
          </>
        )}
      </button>
    </>
  );
}
