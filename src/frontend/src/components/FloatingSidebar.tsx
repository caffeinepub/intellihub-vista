import { useNavigate } from "@tanstack/react-router";
import { Cpu, Home, Info, LogOut, Moon, Sun, Trophy, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { useTheme } from "../hooks/useTheme";

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  target: string;
  isRoute?: boolean;
}

interface FloatingSidebarProps {
  userName: string;
  avatarBase64?: string;
  onLogout: () => void;
  onAboutClick: () => void;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    icon: <Home className="w-5 h-5" />,
    label: "Dashboard",
    target: "home",
  },
  {
    id: "tools",
    icon: <Cpu className="w-5 h-5" />,
    label: "AI Tools",
    target: "tools",
  },
  {
    id: "achievements",
    icon: <Trophy className="w-5 h-5" />,
    label: "Achievements",
    target: "dashboard",
  },
  {
    id: "profile",
    icon: <User className="w-5 h-5" />,
    label: "Profile",
    target: "/profile",
    isRoute: true,
  },
  {
    id: "about",
    icon: <Info className="w-5 h-5" />,
    label: "About",
    target: "about",
  },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function FloatingSidebar({
  userName,
  avatarBase64,
  onLogout,
  onAboutClick,
}: FloatingSidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleNavClick = (item: NavItem) => {
    if (item.id === "about") return onAboutClick();
    if (item.isRoute) return navigate({ to: item.target as "/profile" });
    scrollTo(item.target);
  };

  if (isMobile) {
    return (
      <nav
        aria-label="Bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-white/10 flex items-center justify-around px-2 py-2 md:hidden"
        data-ocid="nav.panel"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavClick(item)}
            data-ocid={`nav.${item.id}.link`}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-[9px] font-medium">{item.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={toggleTheme}
          data-ocid="nav.theme.toggle"
          className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span className="text-[9px] font-medium">Theme</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          data-ocid="nav.logout.button"
          className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] font-medium">Sign Out</span>
        </button>
      </nav>
    );
  }

  return (
    <motion.nav
      aria-label="Side navigation"
      data-ocid="nav.panel"
      className="fixed left-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col rounded-2xl glass-card border border-white/10 overflow-hidden"
      initial={false}
      animate={{ width: expanded ? 192 : 60 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* User avatar */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/8">
        {avatarBase64 ? (
          <img
            src={avatarBase64}
            alt="avatar"
            className="w-9 h-9 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 flex-shrink-0 rounded-full btn-gradient flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
        )}
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium text-foreground truncate max-w-[110px]"
            >
              {userName}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col gap-1 py-3 px-1.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavClick(item)}
            data-ocid={`nav.${item.id}.link`}
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors group"
            aria-label={item.label}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col gap-1 py-3 px-1.5 border-t border-white/8">
        <button
          type="button"
          onClick={toggleTheme}
          data-ocid="nav.theme.toggle"
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
          aria-label="Toggle theme"
        >
          <span className="flex-shrink-0">
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </span>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          type="button"
          onClick={onLogout}
          data-ocid="nav.logout.button"
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Sign out"
        >
          <span className="flex-shrink-0">
            <LogOut className="w-5 h-5" />
          </span>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  );
}
