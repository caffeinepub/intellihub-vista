import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AiChatAssistantProps {
  lastUsedTool: string | null;
  toolUsageCount: number;
}

interface Message {
  id: string;
  from: "ai" | "user";
  text: string;
}

const TOOL_SUGGESTIONS: Record<string, string> = {
  "Medical Diagnosis":
    "Great choice! After checking your health, explore Mentor AI for wellness guidance.",
  "AI Career Guidance":
    "Career planning done! Try Smart Study AI to build skills for your new path.",
  "Mentor AI":
    "Mentorship unlocked! Combine it with Instant Knowledge for deeper learning.",
  "Smart Study AI":
    "Study smarter! Use AI Personal Chef to keep your energy up while you learn.",
  "Instant Knowledge":
    "Knowledge acquired! Apply it creatively with Creative AI Studio.",
  "AI Personal Chef":
    "Delicious choices! Check Medical Diagnosis to stay on track health-wise.",
  "Creative AI Studio":
    "Creativity unlocked! Share your journey with Mentor AI for feedback.",
};

function getAutoReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("study"))
    return "Smart Study AI is perfect for that! Give it a try from the tools section.";
  if (t.includes("health") || t.includes("medical"))
    return "Medical Diagnosis can help! Launch it from the tools section for early health insights.";
  if (t.includes("career"))
    return "AI Career Guidance is your best bet! It gives personalized career path recommendations.";
  if (t.includes("food") || t.includes("chef"))
    return "AI Personal Chef has got you covered with smart recipe and meal planning!";
  if (t.includes("creative") || t.includes("art"))
    return "Creative AI Studio is waiting for you! Unleash your creativity.";
  return "I'm here to guide you! Try launching a tool and I'll give you personalized suggestions.";
}

export default function AiChatAssistant({
  lastUsedTool,
  toolUsageCount,
}: AiChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      from: "ai",
      text: "Hello! I'm your IntelliHub AI assistant. Launch some tools and I'll guide you!",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevToolRef = useRef<string | null>(null);
  const prevCountRef = useRef(0);

  // Tool-specific suggestion on new tool launch
  useEffect(() => {
    if (lastUsedTool && lastUsedTool !== prevToolRef.current) {
      prevToolRef.current = lastUsedTool;
      const suggestion = TOOL_SUGGESTIONS[lastUsedTool];
      if (suggestion) {
        const msg: Message = {
          id: `tool-${Date.now()}`,
          from: "ai",
          text: suggestion,
        };
        setMessages((prev) => [...prev, msg]);
        if (!isOpen) setHasUnread(true);
      }
    }
  }, [lastUsedTool, isOpen]);

  // Milestone suggestions
  useEffect(() => {
    if (toolUsageCount === prevCountRef.current) return;
    prevCountRef.current = toolUsageCount;

    let milestone: string | null = null;
    if (toolUsageCount === 3)
      milestone =
        "You're on a roll! You've used 3 tools. Try them all to unlock the Hub Master badge!";
    else if (toolUsageCount === 5)
      milestone =
        "Incredible! 5 tools used. You're becoming an IntelliHub power user! 🚀";
    else if (toolUsageCount === 7)
      milestone =
        "🏆 Hub Master achieved! You've explored every tool in IntelliHub Vista!";

    if (milestone) {
      const msg: Message = {
        id: `milestone-${toolUsageCount}`,
        from: "ai",
        text: milestone,
      };
      setMessages((prev) => [...prev, msg]);
      if (!isOpen) setHasUnread(true);
    }
  }, [toolUsageCount, isOpen]);

  // Auto-scroll to bottom
  // biome-ignore lint/correctness/useExhaustiveDependencies: messages.length triggers scroll, ref access is intentional
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      from: "user",
      text: trimmed,
    };
    const aiMsg: Message = {
      id: `ai-${Date.now() + 1}`,
      from: "ai",
      text: getAutoReply(trimmed),
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputText("");
  };

  return (
    <div
      className="fixed bottom-24 md:bottom-6 right-4 z-50 flex flex-col items-end gap-3"
      data-ocid="chat.panel"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{
              width: 320,
              maxHeight: 420,
              background: "rgba(10,10,20,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0,240,255,0.25)",
              boxShadow:
                "0 0 30px rgba(0,240,255,0.12), 0 0 60px rgba(138,43,226,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(0,240,255,0.15)" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span
                  className="font-display font-bold text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #00F0FF, #8A2BE2, #FFD700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  IntelliHub AI
                </span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                data-ocid="chat.close_button"
                className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ maxHeight: 280 }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className="text-xs leading-relaxed rounded-xl px-3 py-2 max-w-[85%]"
                    style={
                      msg.from === "ai"
                        ? {
                            background: "rgba(0,240,255,0.08)",
                            border: "1px solid rgba(0,240,255,0.15)",
                            color: "rgba(255,255,255,0.85)",
                          }
                        : {
                            background:
                              "linear-gradient(135deg,rgba(0,240,255,0.2),rgba(138,43,226,0.2))",
                            border: "1px solid rgba(138,43,226,0.3)",
                            color: "rgba(255,255,255,0.9)",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 border-t flex gap-2"
              style={{ borderColor: "rgba(0,240,255,0.15)" }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                data-ocid="chat.input"
                className="flex-1 rounded-xl px-3 py-2 text-xs outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,240,255,0.2)",
                  color: "rgba(255,255,255,0.85)",
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                data-ocid="chat.submit_button"
                className="rounded-xl px-3 py-2 text-xs font-semibold transition-transform active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#00F0FF,#8A2BE2)",
                  color: "#fff",
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        type="button"
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        data-ocid="chat.open_modal_button"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg"
        style={{
          background: "linear-gradient(135deg,#00F0FF22,#8A2BE222)",
          border: "1.5px solid rgba(0,240,255,0.45)",
          boxShadow:
            "0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(138,43,226,0.15)",
        }}
      >
        🤖
        {hasUnread && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ background: "#FF4444", color: "#fff" }}
          >
            •
          </span>
        )}
      </motion.button>
    </div>
  );
}
