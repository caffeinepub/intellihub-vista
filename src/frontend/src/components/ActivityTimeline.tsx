import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ActivityEntry } from "../hooks/useGameData";

interface ActivityTimelineProps {
  activityLog: ActivityEntry[];
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ActivityTimeline({
  activityLog,
}: ActivityTimelineProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 240, 255);
      doc.text("IntelliHub Vista — Activity Log", 40, 48);

      // Date
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 170);
      doc.text(`Exported on ${new Date().toLocaleString()}`, 40, 66);

      // Divider
      doc.setDrawColor(50, 50, 70);
      doc.line(40, 74, pageW - 40, 74);

      if (activityLog.length === 0) {
        doc.setFontSize(12);
        doc.setTextColor(120, 120, 140);
        doc.text("No activity recorded yet.", 40, 100);
      } else {
        let y = 96;
        doc.setFontSize(12);
        activityLog.forEach((entry, i) => {
          if (y > 760) {
            doc.addPage();
            y = 48;
          }
          doc.setTextColor(200, 200, 220);
          doc.text(`${i + 1}. ${entry.toolEmoji}  ${entry.toolName}`, 40, y);
          doc.setFontSize(9);
          doc.setTextColor(120, 120, 140);
          doc.text(formatDateTime(entry.timestamp), 40, y + 14);
          doc.setFontSize(12);
          y += 34;
        });
      }

      doc.save("intellihub-activity.pdf");
      toast.success("Activity log exported as PDF!");
    } catch {
      toast.error("Failed to export PDF");
    }
    setExporting(false);
  };

  return (
    <div data-ocid="activity.section">
      <div className="flex items-center justify-between mb-4">
        <motion.h2
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-display text-xl font-bold gradient-text"
        >
          Recent Activity
        </motion.h2>
        <button
          type="button"
          onClick={handleExportPDF}
          disabled={exporting || activityLog.length === 0}
          data-ocid="activity.secondary_button"
          className="text-xs px-3 py-1.5 rounded-xl glass-card border border-white/15 hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {exporting ? (
            <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            "📄"
          )}
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      <div
        className="glass-card rounded-2xl overflow-hidden"
        data-ocid="activity.panel"
      >
        {activityLog.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="activity.empty_state"
            className="p-8 text-center text-muted-foreground"
          >
            <div className="text-4xl mb-3">🕹️</div>
            <p className="text-sm font-medium">No activity yet.</p>
            <p className="text-xs mt-1 opacity-70">
              Launch a tool to get started!
            </p>
          </motion.div>
        ) : (
          <ul>
            <AnimatePresence initial={false}>
              {activityLog.map((entry, i) => (
                <motion.li
                  key={`${entry.toolId}-${entry.timestamp}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.04 }}
                  data-ocid={`activity.item.${i + 1}`}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
                >
                  <span className="text-xl flex-shrink-0" aria-hidden="true">
                    {entry.toolEmoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.toolName}
                    </p>
                    <p className="text-xs text-muted-foreground">Launched</p>
                  </div>
                  <time
                    dateTime={entry.timestamp}
                    className="text-xs text-muted-foreground flex-shrink-0 font-mono"
                  >
                    {timeAgo(entry.timestamp)}
                  </time>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
