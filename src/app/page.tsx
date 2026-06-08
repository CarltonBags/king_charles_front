"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#020201", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      {showSplash ? (
        <div className="absolute inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "#020201" }}>
          <img src="/images/PUB_VIEW.png" alt="The Londoner" className="w-full max-w-md h-auto object-contain animate-pixel-in" style={{ imageRendering: "pixelated" }} />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
          <img src="/images/HEADER.png" alt="The Londoner" style={{ maxWidth: "180px", imageRendering: "pixelated" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", width: "100%", maxWidth: "320px" }}>
            {/* Drink Guide card */}
            <div className="animate-fade-in-up" style={{ width: "100%", animationDelay: "0.15s", opacity: 0 }}>
              <button
                onClick={() => router.push("/drink-guide")}
                style={{
                  background: "none",
                  padding: "24px",
                  cursor: "pointer",
                  width: "100%",
                  border: "2px solid #f0f0e0",
                  boxShadow: "0 0 0 3px #020201, 0 0 0 5px #606068",
                }}
              >
                <img src="/images/DRINK_GUIDE.png" alt="Drink Guide" style={{ width: "100%", maxWidth: "160px", display: "block", margin: "0 auto", imageRendering: "pixelated" }} />
              </button>
            </div>

            {/* Quiz card */}
            <div className="animate-fade-in-up" style={{ width: "100%", animationDelay: "0.35s", opacity: 0 }}>
              <button
                onClick={() => router.push("/quiz")}
                style={{
                  background: "none",
                  padding: "24px",
                  cursor: "pointer",
                  width: "100%",
                  border: "2px solid #f0f0e0",
                  boxShadow: "0 0 0 3px #020201, 0 0 0 5px #606068",
                }}
              >
                <img src="/images/QUIZ_CARD.png" alt="Pub Quiz" style={{ width: "100%", maxWidth: "160px", display: "block", margin: "0 auto", imageRendering: "pixelated" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
