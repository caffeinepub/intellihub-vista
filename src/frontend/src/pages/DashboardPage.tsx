import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Activity,
  BookOpen,
  Brain,
  Briefcase,
  ChefHat,
  ExternalLink,
  LogOut,
  Palette,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const TOOLS = [
  {
    id: 1,
    name: "Smart Study AI",
    description:
      "Intelligent study planning and personalized learning schedules",
    url: "https://smartstudy-ai-cup.caffeine.xyz",
    icon: BookOpen,
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "oklch(0.72 0.22 330)",
  },
  {
    id: 2,
    name: "AI Career Guidance",
    description:
      "Personalized career path recommendations and skill gap analysis",
    url: "https://ai-career-guidance-platform-zw8.caffeine.xyz",
    icon: Briefcase,
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "oklch(0.72 0.22 50)",
  },
  {
    id: 3,
    name: "Mentor AI",
    description: "Connect with AI mentors for guidance and knowledge sharing",
    url: "https://react-9b5mk3.onspace.build",
    icon: Users,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "oklch(0.65 0.22 290)",
  },
  {
    id: 4,
    name: "Instant Knowledge",
    description: "Instant answers and deep knowledge on any topic",
    url: "https://react-9b5yj2.onspace.build",
    icon: Zap,
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "oklch(0.72 0.18 210)",
  },
  {
    id: 5,
    name: "AI Personal Chef",
    description: "Smart recipe suggestions and personalized meal planning",
    url: "https://ai-personal-chef-tea.caffeine.xyz",
    icon: ChefHat,
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "oklch(0.7 0.2 160)",
  },
  {
    id: 6,
    name: "Medical Diagnosis",
    description: "Early disease prediction and health monitoring assistance",
    url: "https://react-9b5yio.onspace.build",
    icon: Activity,
    gradient: "from-red-500/20 to-rose-500/20",
    iconColor: "oklch(0.65 0.22 15)",
  },
  {
    id: 7,
    name: "Creative AI Studio",
    description: "AI-powered creative tools for art, design, and content",
    url: "https://creative-ai-studio-zy9.caffeine.xyz",
    icon: Palette,
    gradient: "from-fuchsia-500/20 to-pink-500/20",
    iconColor: "oklch(0.68 0.24 320)",
  },
] as const;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setAboutOpen(true)}
            data-ocid="nav.logo.button"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1"
            type="button"
            aria-label="About IntelliHub Vista"
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-md opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.65 0.22 330), oklch(0.65 0.22 12))",
                }}
              />
              <img
                src="/assets/uploads/Hexagonal-Neural-Hub-Icon-with-Vibrant-Colors_20260307_184744_0000-1.png"
                alt="IntelliHub Vista"
                className="w-9 h-9 object-contain relative z-10"
              />
            </div>
            <span className="font-display font-bold text-lg gradient-text hidden sm:block">
              IntelliHub Vista
            </span>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome,{" "}
              <span className="text-foreground font-medium">{user?.name}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-ocid="nav.logout.button"
              className="border-border/50 hover:border-destructive/50 hover:text-destructive hover:bg-destructive/10 gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.24 330 / 0.3), oklch(0.65 0.22 12 / 0.3))",
              }}
            >
              <Brain
                className="w-5 h-5"
                style={{ color: "oklch(0.75 0.22 330)" }}
              />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold">
              <span className="gradient-text">AI Tools</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our suite of intelligent applications — each designed to
            solve real-world problems with the power of artificial intelligence.
          </p>
        </motion.div>

        {/* Tools grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="tools.grid"
        >
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                variants={cardVariants}
                data-ocid={`tools.item.${tool.id}`}
                className="gradient-border rounded-2xl bg-card/70 backdrop-blur-sm p-6 card-hover group relative overflow-hidden"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${tool.iconColor}25, ${tool.iconColor}15)`,
                      border: `1px solid ${tool.iconColor}30`,
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: tool.iconColor }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold text-lg mb-2 text-foreground">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {tool.description}
                  </p>

                  {/* Launch button */}
                  <Button
                    asChild
                    size="sm"
                    data-ocid={`tools.launch.button.${tool.id}`}
                    className="w-full gap-2 font-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.24 330 / 0.8), oklch(0.65 0.22 12 / 0.8))",
                      border: "none",
                    }}
                  >
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Launch
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
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

      {/* About Modal */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent
          data-ocid="about.dialog"
          className="max-w-lg bg-card/95 backdrop-blur-xl border-border/50"
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/assets/uploads/Hexagonal-Neural-Hub-Icon-with-Vibrant-Colors_20260307_184744_0000-1.png"
                alt="IntelliHub Vista"
                className="w-12 h-12 object-contain"
              />
              <DialogTitle className="font-display text-2xl gradient-text">
                IntelliHub Vista
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-2">
            <p className="text-muted-foreground text-sm leading-relaxed">
              IntelliHub Vista is a smart web platform that brings together
              multiple AI-powered applications in one place. Each AI tool on the
              website is designed to solve a specific real-world problem such as
              smart study planning, waste segregation using image processing,
              early disease prediction, career guidance, phishing website
              detection, and energy monitoring.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-4">
              By integrating these intelligent systems into a single hub,
              IntelliHub Vista provides users with practical, technology-driven
              solutions that improve learning, safety, health, sustainability,
              and efficiency in everyday life. The platform demonstrates how
              artificial intelligence can be used to create smarter and more
              helpful digital tools for the future.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setAboutOpen(false)}
              data-ocid="about.close_button"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.24 330), oklch(0.65 0.22 12))",
                border: "none",
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
