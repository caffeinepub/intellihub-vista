import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
      el.style.opacity = "1";
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-50 top-0 left-0 w-[200px] h-[200px] rounded-full opacity-0 transition-opacity duration-300 hidden md:block"
      style={{
        background:
          "radial-gradient(circle, rgba(0, 240, 255, 0.12) 0%, rgba(138, 43, 226, 0.08) 50%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
