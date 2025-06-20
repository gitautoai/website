"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import InstallButton from "../Button/Install";
import { Particle } from "./types";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size - full width, hero section height only
    const resizeCanvas = () => {
      const heroSection = canvas.parentElement;
      if (heroSection) {
        canvas.width = window.innerWidth;
        canvas.height = heroSection.offsetHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 35 : 100;

      particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? "#ec4899" : "#8b5cf6",
      }));
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check with bounce
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw connection lines between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = ((100 - distance) / 100) * 0.05;
            ctx.strokeStyle = "#ec4899";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen h-screen flex flex-col items-center justify-center gap-2 sm:gap-2 md:gap-4 text-center relative"
      aria-label="Hero section"
    >
      {/* Background canvas for particles only */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none -z-10"
        style={{ width: "100vw", height: "100%" }}
      />

      <motion.h1
        className="text-4xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent pb-0 mt-0 mb-0 sm:mt-14 md:mt-10 sm:w-12/12 md:w-11/12 h-32 sm:h-20 md:h-32"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Go from 0% to 90%
        <br className="hidden sm:block" />
        Test Coverage on GitHub
      </motion.h1>

      <motion.p
        className="text-lg sm:text-lg md:text-2xl lg:text-3xl font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        GitAuto automatically writes, runs, and fixes your unit tests,
        <br className="hidden sm:block" /> so you can keep shipping confidently.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <InstallButton text="Start Free – Add to GitHub" />
      </motion.div>

      <motion.p
        className="text-sm sm:text-xs md:text-sm lg:text-base text-gray-500 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        No credit card required. Get started in seconds.
      </motion.p>
    </section>
  );
};

export default Hero;
