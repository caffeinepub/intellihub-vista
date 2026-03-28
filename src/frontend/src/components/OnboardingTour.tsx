import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Profile } from "../hooks/useProfile";

interface Step {
  title: string;
  description: string;
  emoji: string;
}

const STEPS: Step[] = [
  {
    title: "Welcome to IntelliHub Vista!",
    description:
      "Your personal AI command centre. Let's take a quick tour to help you get started.",
    emoji: "🚀",
  },
  {
    title: "AI Core Orb",
    description:
      "The glowing orb at the top is your AI Core. Hover over the orbiting tool icons to preview each tool, then click to explore.",
    emoji: "🌐",
  },
  {
    title: "AI Tools Grid",
    description:
      "Scroll down to see all 7 AI tools. Tap the ⭐ star icon on any card to pin it as your favourite featured tool.",
    emoji: "🛠️",
  },
  {
    title: "Your Profile",
    description:
      "Visit your Profile page to upload an avatar, set a display name, and track your daily streak. Keep using tools every day to build your streak!",
    emoji: "👤",
  },
];

const STEP_IDS = ["welcome", "orb", "tools", "profile"];

interface OnboardingTourProps {
  profile: Profile;
  markOnboardingDone: () => void;
}

export default function OnboardingTour({
  profile,
  markOnboardingDone,
}: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  if (profile.onboardingDone) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      markOnboardingDone();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => markOnboardingDone();

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.7)" }}
        data-ocid="onboarding.modal"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card rounded-3xl p-8 max-w-md w-full mx-4 relative"
            style={{
              border: "1px solid rgba(0,240,255,0.25)",
              boxShadow:
                "0 0 60px rgba(0,240,255,0.15), 0 0 120px rgba(138,43,226,0.1)",
            }}
          >
            {/* Step dots */}
            <div className="flex gap-2 mb-6">
              {STEPS.map((_, i) => (
                <motion.div
                  key={STEP_IDS[i]}
                  animate={{
                    width: i === step ? 24 : 8,
                    opacity: i <= step ? 1 : 0.35,
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full"
                  style={{
                    background: "linear-gradient(90deg,#00F0FF,#8A2BE2)",
                  }}
                />
              ))}
            </div>

            {/* Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: 0.1,
              }}
              className="text-6xl mb-5 text-center"
            >
              {current.emoji}
            </motion.div>

            {/* Text */}
            <h2 className="font-display text-2xl font-bold gradient-text text-center mb-3">
              {current.title}
            </h2>
            <p className="text-muted-foreground text-sm text-center leading-relaxed mb-8">
              {current.description}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSkip}
                data-ocid="onboarding.cancel_button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-xl hover:bg-white/8"
              >
                Skip tour
              </button>
              <button
                type="button"
                onClick={handleNext}
                data-ocid="onboarding.confirm_button"
                className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
              >
                {isLast ? "Get Started 🎉" : "Next →"}
              </button>
            </div>

            {/* Step counter */}
            <p className="text-center text-[11px] text-muted-foreground mt-4 opacity-60">
              Step {step + 1} of {STEPS.length}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
