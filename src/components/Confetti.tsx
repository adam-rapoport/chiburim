"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

const COLORS = ["#F9DF6D", "#A0C35A", "#B0C4EF", "#BA81C5", "#FF6B6B", "#4ECDC4"];

export default function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 8,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed z-[100] pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0],
            rotate: p.rotation + 720,
            x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </AnimatePresence>
  );
}
