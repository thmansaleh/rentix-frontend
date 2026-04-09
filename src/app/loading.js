"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 8;
      });
    }, 300);

    const dotsTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(dotsTimer);
    };
  }, []);

  return (
    <div style={styles.overlay}>
      <style>{css}</style>

      {/* Road stripes */}
      <div style={styles.road}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="stripe" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      <div style={styles.card}>
        {/* Car SVG */}
        <div className="car-wrapper" style={styles.carWrapper}>
          <svg
            viewBox="0 0 200 80"
            style={styles.carSvg}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Car body */}
            <rect x="20" y="35" width="160" height="35" rx="8" fill="#E63946" />
            {/* Roof */}
            <path d="M55 35 Q65 10 90 10 L130 10 Q155 10 165 35 Z" fill="#C1121F" />
            {/* Windows */}
            <path d="M62 33 Q70 14 90 14 L110 14 Q115 18 117 33 Z" fill="#90E0EF" opacity="0.9" />
            <path d="M120 33 Q122 18 130 14 L148 14 Q158 18 162 33 Z" fill="#90E0EF" opacity="0.9" />
            {/* Windshield divider */}
            <line x1="118" y1="14" x2="118" y2="33" stroke="#C1121F" strokeWidth="2" />
            {/* Wheels */}
            <circle cx="55" cy="70" r="14" fill="#1A1A2E" />
            <circle cx="55" cy="70" r="7" fill="#E63946" className="wheel" />
            <circle cx="55" cy="70" r="3" fill="#1A1A2E" />
            <circle cx="145" cy="70" r="14" fill="#1A1A2E" />
            <circle cx="145" cy="70" r="7" fill="#E63946" className="wheel" />
            <circle cx="145" cy="70" r="3" fill="#1A1A2E" />
            {/* Headlights */}
            <rect x="172" y="44" width="10" height="6" rx="2" fill="#FFD60A" />
            {/* Tail lights */}
            <rect x="18" y="44" width="6" height="6" rx="2" fill="#FF006E" />
            {/* Door line */}
            <line x1="105" y1="36" x2="105" y2="68" stroke="#C1121F" strokeWidth="1.5" />
            {/* Door handle */}
            <rect x="85" y="51" width="12" height="3" rx="1.5" fill="#C1121F" />
            <rect x="115" y="51" width="12" height="3" rx="1.5" fill="#C1121F" />
          </svg>

          {/* Exhaust puffs */}
          <div className="puff puff1" style={styles.puff} />
          <div className="puff puff2" style={{ ...styles.puff, width: 10, height: 10 }} />
          <div className="puff puff3" style={{ ...styles.puff, width: 7, height: 7 }} />
        </div>

        {/* Text */}
        <h1 style={styles.title}>RentCar</h1>
        <p style={styles.subtitle}>Loading your experience{dots}</p>

        {/* Progress bar */}
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${Math.min(progress, 95)}%`,
            }}
          />
          <div style={styles.progressGlow} />
        </div>

        <p style={styles.percent}>{Math.min(Math.round(progress), 95)}%</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(160deg, #0D0D1A 0%, #1A0A0A 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    overflow: "hidden",
    zIndex: 9999,
  },
  road: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "6px",
    background: "#111",
    display: "flex",
    gap: "30px",
    paddingLeft: "10px",
    alignItems: "center",
    overflow: "hidden",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "48px 56px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "24px",
    border: "1px solid rgba(230,57,70,0.25)",
    boxShadow: "0 0 80px rgba(230,57,70,0.1), 0 32px 64px rgba(0,0,0,0.5)",
    backdropFilter: "blur(12px)",
  },
  carWrapper: {
    position: "relative",
    width: "200px",
  },
  carSvg: {
    width: "200px",
    height: "80px",
    filter: "drop-shadow(0 8px 20px rgba(230,57,70,0.5))",
  },
  puff: {
    position: "absolute",
    bottom: "14px",
    left: "-14px",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "rgba(200,200,200,0.25)",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.5px",
    minWidth: "190px",
    textAlign: "center",
  },
  progressTrack: {
    position: "relative",
    width: "240px",
    height: "6px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "99px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #C1121F, #E63946, #FF6B6B)",
    borderRadius: "99px",
    transition: "width 0.3s ease",
  },
  progressGlow: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, transparent 60%, rgba(255,100,100,0.4) 100%)",
    borderRadius: "99px",
  },
  percent: {
    margin: 0,
    fontSize: "12px",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "1px",
  },
};

const css = `
  @keyframes drive {
    0%   { transform: translateX(0); }
    50%  { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }

  @keyframes wheelSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes stripeMarch {
    from { transform: translateX(0); }
    to   { transform: translateX(-60px); }
  }

  @keyframes puffFloat {
    0%   { opacity: 0.6; transform: translateX(0) scale(1); }
    100% { opacity: 0;   transform: translateX(-40px) scale(2.5); }
  }

  .car-wrapper {
    animation: drive 0.4s ease-in-out infinite;
  }

  .wheel {
    transform-origin: center;
    animation: wheelSpin 0.5s linear infinite;
  }

  .stripe {
    width: 40px;
    height: 4px;
    background: rgba(255,255,255,0.12);
    border-radius: 2px;
    flex-shrink: 0;
    animation: stripeMarch 0.6s linear infinite;
  }

  .puff {
    animation: puffFloat 1s ease-out infinite;
  }
  .puff2 { animation-delay: 0.3s; }
  .puff3 { animation-delay: 0.6s; }
`;