import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 1000,
        padding: "0.6rem 1rem",
        borderRadius: "8px",
        border: "none",
        background: "#4F46E5",
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
      aria-label="Back to top"
    >
      ↑ Top
    </button>
  );
}