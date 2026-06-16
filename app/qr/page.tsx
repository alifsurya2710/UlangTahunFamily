"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

const SITE_URL = "https://ulang-tahun-family.vercel.app";

// Floating particle component
const FloatingParticle = ({
  emoji,
  style,
  animDuration,
  animDelay,
}: {
  emoji: string;
  style: React.CSSProperties;
  animDuration?: number;
  animDelay?: number;
}) => (
  <motion.div
    className="absolute pointer-events-none select-none text-2xl md:text-4xl"
    style={style}
    animate={{
      y: [0, -30, 0],
      rotate: [-10, 10, -10],
      scale: [1, 1.15, 1],
      opacity: [0.4, 0.8, 0.4],
    }}
    transition={{
      duration: animDuration ?? 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: animDelay ?? 0,
    }}
  >
    {emoji}
  </motion.div>
);

export default function QRPage() {
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scanFlash, setScanFlash] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // Scan flash pulse every 3s
    const interval = setInterval(() => {
      setScanFlash(true);
      setTimeout(() => setScanFlash(false), 700);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);

    const canvas = document.createElement("canvas");
    const scale = 4; // High-res
    canvas.width = 400 * scale;
    canvas.height = 400 * scale;
    const ctx = canvas.getContext("2d")!;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#ff758c");
    grad.addColorStop(1, "#ff416c");
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, canvas.width, canvas.height, 60 * scale);
    ctx.fill();

    // White QR area
    const padding = 50 * scale;
    ctx.fillStyle = "white";
    ctx.roundRect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2, 30 * scale);
    ctx.fill();

    const img = new window.Image();
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const qrPad = 80 * scale;
      ctx.drawImage(img, qrPad, qrPad, canvas.width - qrPad * 2, canvas.height - qrPad * 2);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = "qr-ulang-tahun-family.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  const particles = [
    { emoji: "🎂", top: "8%", left: "5%", animDuration: 6, animDelay: 0 },
    { emoji: "💖", top: "15%", right: "6%", animDuration: 7, animDelay: 1 },
    { emoji: "🎈", top: "70%", left: "3%", animDuration: 5.5, animDelay: 0.5 },
    { emoji: "✨", top: "80%", right: "5%", animDuration: 6.5, animDelay: 2 },
    { emoji: "🎁", top: "45%", left: "2%", animDuration: 8, animDelay: 1.5 },
    { emoji: "🎊", top: "30%", right: "3%", animDuration: 7, animDelay: 0.8 },
    { emoji: "💕", top: "60%", right: "7%", animDuration: 5, animDelay: 2.5 },
    { emoji: "🌸", top: "5%", left: "50%", animDuration: 9, animDelay: 1 },
  ];

  return (
    <div className="qr-page-root min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-outfit">
      {/* Animated gradient background */}
      <div className="qr-bg-mesh" />
      <div className="qr-bg-orb qr-bg-orb-1" />
      <div className="qr-bg-orb qr-bg-orb-2" />
      <div className="qr-bg-orb qr-bg-orb-3" />

      {/* Dot pattern */}
      <div className="absolute inset-0 qr-dot-pattern pointer-events-none z-0" />

      {/* Floating Particles */}
      {isMounted &&
        particles.map((p, i) => (
          <FloatingParticle
            key={i}
            emoji={p.emoji}
            animDuration={p.animDuration}
            animDelay={p.animDelay}
            style={{
              top: p.top,
              left: (p as any).left,
              right: (p as any).right,
              zIndex: 5,
            }}
          />
        ))}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-white/20 backdrop-blur-sm shadow-lg">
          <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
        </div>
        <span className="text-base md:text-lg font-black text-white/90 tracking-widest uppercase drop-shadow">
          MYFAMILYBIRTHDAY
        </span>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10 qr-card"
      >
        {/* Card inner glow top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[2.5rem] bg-gradient-to-r from-pink-300 via-rose-400 to-pink-300 opacity-80" />

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="qr-badge">
            🎉 Scan & Buka Kejutannya!
          </span>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-black text-center text-pink-800 tracking-tighter leading-tight mb-2"
        >
          Ulang Tahun
          <br />
          <span className="qr-title-gradient">Keluarga Kita</span>
        </motion.h1>

        <p className="text-center text-pink-500/70 font-bold text-xs md:text-sm uppercase tracking-[0.25em] mb-8">
          Kado Digital Penuh Cinta 💖
        </p>

        {/* QR Code Container */}
        <motion.div
          className="relative mx-auto flex items-center justify-center mb-8"
          style={{ width: "fit-content" }}
        >
          {/* Rotating border ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-[2rem] border-4 border-dashed border-pink-300/40 pointer-events-none"
          />

          {/* Outer glow ring */}
          <motion.div
            animate={{
              boxShadow: scanFlash
                ? "0 0 60px 20px rgba(255, 75, 110, 0.5), 0 0 120px 40px rgba(255, 117, 140, 0.25)"
                : "0 0 30px 8px rgba(255, 75, 110, 0.2)",
            }}
            transition={{ duration: 0.4 }}
            className="qr-outer-ring"
          >
            {/* Scan line animation */}
            <AnimatePresence>
              {scanFlash && (
                <motion.div
                  initial={{ top: "0%", opacity: 0.9 }}
                  animate={{ top: "100%", opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeIn" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent z-20 pointer-events-none rounded-full"
                />
              )}
            </AnimatePresence>

            {/* QR Code itself */}
            <div className="qr-inner-box relative z-10">
              <QRCodeSVG
                ref={svgRef}
                value={SITE_URL}
                size={220}
                bgColor="transparent"
                fgColor="#c9184a"
                level="H"
                marginSize={1}
                imageSettings={{
                  src: "/logo.png",
                  height: 44,
                  width: 44,
                  excavate: true,
                }}
              />
            </div>

            {/* Corner decorators */}
            <div className="qr-corner qr-corner-tl" />
            <div className="qr-corner qr-corner-tr" />
            <div className="qr-corner qr-corner-bl" />
            <div className="qr-corner qr-corner-br" />
          </motion.div>
        </motion.div>

        {/* URL display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="qr-url-box"
          onClick={handleCopy}
          role="button"
          aria-label="Salin link"
        >
          <span className="text-pink-400 font-bold text-[10px] uppercase tracking-widest block mb-1">
            🔗 Link Website
          </span>
          <span className="text-pink-700 font-black text-sm md:text-base break-all">
            {SITE_URL}
          </span>
          <AnimatePresence>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 block text-green-500 font-black text-xs uppercase tracking-widest"
              >
                ✅ Tersalin!
              </motion.span>
            ) : (
              <motion.span
                key="copy-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 block text-pink-300 font-bold text-[10px] uppercase tracking-widest"
              >
                Ketuk untuk menyalin
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 mt-6"
        >
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="qr-open-btn"
            className="qr-btn qr-btn-primary flex-1"
          >
            <span>🎊</span>
            <span>Buka Website</span>
          </a>
          <button
            id="qr-download-btn"
            onClick={handleDownload}
            className="qr-btn qr-btn-outline"
          >
            <span>⬇️</span>
            <span className="hidden md:inline">Unduh QR</span>
          </button>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-pink-300 font-bold text-[10px] uppercase tracking-widest mt-6">
          Dibuat dengan 💖 oleh Moch Alif Surya Ramadhan
        </p>
      </motion.div>

      {/* Bottom floating decoration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 mt-8 flex gap-4 text-3xl"
      >
        {["🎂", "💖", "🎈", "✨", "🎁"].map((e, i) => (
          <motion.span
            key={e}
            animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            className="drop-shadow-lg"
          >
            {e}
          </motion.span>
        ))}
      </motion.div>

      <style>{`
        .qr-page-root {
          background: #fff0f3;
          font-family: var(--font-outfit, sans-serif);
        }

        /* Animated mesh gradient bg */
        .qr-bg-mesh {
          position: fixed;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(ellipse at 0% 0%, #ffe4e9 0%, transparent 55%),
            radial-gradient(ellipse at 100% 100%, #ffd6e0 0%, transparent 55%),
            radial-gradient(ellipse at 50% 50%, #fff0f3 0%, #ffe4e9 100%);
        }

        /* Soft orbs */
        .qr-bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: orbPulse 8s ease-in-out infinite;
        }
        .qr-bg-orb-1 {
          width: 500px; height: 500px;
          background: rgba(255, 117, 140, 0.18);
          top: -150px; left: -100px;
          animation-delay: 0s;
        }
        .qr-bg-orb-2 {
          width: 400px; height: 400px;
          background: rgba(255, 180, 200, 0.22);
          bottom: -100px; right: -80px;
          animation-delay: 3s;
        }
        .qr-bg-orb-3 {
          width: 300px; height: 300px;
          background: rgba(255, 65, 108, 0.12);
          top: 40%; left: 50%;
          transform: translateX(-50%);
          animation-delay: 5s;
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.12) translateY(-20px); }
        }

        /* Dot pattern */
        .qr-dot-pattern {
          background-image: radial-gradient(#ffb3c1 0.6px, transparent 0.6px);
          background-size: 28px 28px;
          opacity: 0.4;
        }

        /* Card */
        .qr-card {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          border-radius: 2.5rem;
          padding: 2.5rem 2rem;
          box-shadow:
            0 8px 40px rgba(255, 75, 110, 0.14),
            0 2px 8px rgba(255, 117, 140, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.8);
          max-width: 420px;
          width: 92vw;
        }

        @media (min-width: 640px) {
          .qr-card {
            padding: 3rem 2.5rem;
          }
        }

        /* Badge */
        .qr-badge {
          display: inline-block;
          padding: 0.4rem 1.2rem;
          background: linear-gradient(135deg, #ff758c, #ff416c);
          color: white;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          box-shadow: 0 4px 15px rgba(255, 65, 108, 0.35);
        }

        /* Gradient title */
        .qr-title-gradient {
          background: linear-gradient(135deg, #ff416c 0%, #ff758c 50%, #ff7eb3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* QR outer ring */
        .qr-outer-ring {
          position: relative;
          padding: 1.25rem;
          background: linear-gradient(145deg, #fff5f7, #ffe4e9);
          border-radius: 1.75rem;
          border: 2px solid rgba(255, 117, 140, 0.2);
          overflow: hidden;
        }

        /* QR inner box */
        .qr-inner-box {
          background: white;
          border-radius: 1.25rem;
          padding: 0.75rem;
          box-shadow:
            0 4px 20px rgba(255, 75, 110, 0.12),
            inset 0 1px 0 rgba(255,255,255,1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Corners */
        .qr-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: #ff758c;
          border-style: solid;
          pointer-events: none;
        }
        .qr-corner-tl { top: 8px; left: 8px; border-width: 3px 0 0 3px; border-radius: 6px 0 0 0; }
        .qr-corner-tr { top: 8px; right: 8px; border-width: 3px 3px 0 0; border-radius: 0 6px 0 0; }
        .qr-corner-bl { bottom: 8px; left: 8px; border-width: 0 0 3px 3px; border-radius: 0 0 0 6px; }
        .qr-corner-br { bottom: 8px; right: 8px; border-width: 0 3px 3px 0; border-radius: 0 0 6px 0; }

        /* URL box */
        .qr-url-box {
          background: rgba(255, 240, 243, 0.7);
          border: 1.5px solid rgba(255, 117, 140, 0.2);
          border-radius: 1.25rem;
          padding: 1rem 1.25rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .qr-url-box:hover {
          background: rgba(255, 200, 215, 0.4);
          border-color: rgba(255, 75, 110, 0.35);
          transform: scale(1.01);
        }
        .qr-url-box:active {
          transform: scale(0.98);
        }

        /* Buttons */
        .qr-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 1.25rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: all 0.25s ease;
          cursor: pointer;
          border: none;
          outline: none;
          text-decoration: none;
        }
        .qr-btn:active { transform: scale(0.95); }
        .qr-btn-primary {
          background: linear-gradient(135deg, #ff758c 0%, #ff416c 100%);
          color: white;
          box-shadow: 0 6px 20px rgba(255, 65, 108, 0.35);
        }
        .qr-btn-primary:hover {
          box-shadow: 0 8px 28px rgba(255, 65, 108, 0.5);
          transform: translateY(-1px);
        }
        .qr-btn-outline {
          background: rgba(255, 240, 243, 0.8);
          color: #ff416c;
          border: 1.5px solid rgba(255, 117, 140, 0.3);
          min-width: 56px;
        }
        .qr-btn-outline:hover {
          background: rgba(255, 200, 215, 0.5);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
