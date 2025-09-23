"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

// Define interfaces for the different bubble types
interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  color: string;
}

interface ColorfulBubble {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  pulseDirection: number;
  pulseSpeed: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  blinkSpeed: number;
  angle: number;
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Bubble particles
    const bubbles: Bubble[] = [];
    const stars: Star[] = [];
    const colorfulBubbles: ColorfulBubble[] = [];

    // Create regular bubbles
    for (let i = 0; i < 20; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 20 + 5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        // Theme-based bubble colors
        color:
          theme === "dark"
            ? `rgba(100, 116, 139, ${Math.random() * 0.3 + 0.1})` // Gray for dark theme
            : `rgba(165, 180, 252, ${Math.random() * 0.3 + 0.1})`, // Indigo for light theme
      });
    }

    // Create colorful bubbles for more vibrant animation
    const vibrantColors = [
      "rgba(239, 68, 68, 0.7)", // Red
      "rgba(59, 130, 246, 0.7)", // Blue
      "rgba(16, 185, 129, 0.7)", // Green
      "rgba(245, 158, 11, 0.7)", // Yellow
      "rgba(139, 92, 246, 0.7)", // Purple
      "rgba(236, 72, 153, 0.7)", // Pink
    ];

    for (let i = 0; i < 15; i++) {
      colorfulBubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 25 + 10,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.7 + 0.3,
        color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // Create stars
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        blinkSpeed: Math.random() * 0.02 + 0.005,
        angle: Math.random() * Math.PI * 2,
      });
    }

    let animationFrameId: number;

    const draw = () => {
      if (!ctx) return;

      // Clear canvas with a theme-appropriate background with subtle gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (theme === "dark") {
        gradient.addColorStop(0, "rgba(15, 23, 42, 0.03)"); // Dark blue-gray for dark theme
        gradient.addColorStop(1, "rgba(30, 41, 59, 0.03)");
      } else {
        gradient.addColorStop(0, "rgba(248, 250, 252, 0.03)"); // Light gray for light theme
        gradient.addColorStop(1, "rgba(226, 232, 240, 0.03)");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw regular bubbles with theme-appropriate colors
      bubbles.forEach((bubble) => {
        // Update bubble color based on current theme
        bubble.color =
          theme === "dark"
            ? `rgba(100, 116, 139, ${bubble.opacity})` // Gray for dark theme
            : `rgba(165, 180, 252, ${bubble.opacity})`; // Indigo for light theme

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();

        // Move bubble
        bubble.y -= bubble.speed;
        if (bubble.y < -bubble.radius) {
          bubble.y = canvas.height + bubble.radius;
          bubble.x = Math.random() * canvas.width;
        }
      });

      // Draw colorful bubbles with pulsing effect
      colorfulBubbles.forEach((bubble) => {
        // Pulsing effect
        bubble.radius += bubble.pulseDirection * bubble.pulseSpeed;
        if (bubble.radius > 35 || bubble.radius < 10) {
          bubble.pulseDirection *= -1;
        }

        // Move bubble with bouncing effect
        bubble.x += bubble.speedX;
        bubble.y += bubble.speedY;

        // Bounce off edges
        if (
          bubble.x < bubble.radius ||
          bubble.x > canvas.width - bubble.radius
        ) {
          bubble.speedX *= -1;
        }
        if (
          bubble.y < bubble.radius ||
          bubble.y > canvas.height - bubble.radius
        ) {
          bubble.speedY *= -1;
        }

        // Draw bubble with glow effect
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);

        // Create glow effect
        const gradient = ctx.createRadialGradient(
          bubble.x,
          bubble.y,
          0,
          bubble.x,
          bubble.y,
          bubble.radius * 2
        );
        gradient.addColorStop(0, bubble.color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw inner bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color.replace(/[\d\.]+\)$/, "0.9)");
        ctx.fill();
      });

      // Draw stars
      stars.forEach((star) => {
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.angle);

        // Pulsing effect
        const pulse = Math.sin(Date.now() * star.blinkSpeed) * 0.5 + 0.5;
        const currentOpacity = star.opacity * pulse;

        // Theme-appropriate star color
        const starColor =
          theme === "dark"
            ? `rgba(255, 255, 255, ${currentOpacity})` // White stars for dark theme
            : `rgba(30, 41, 59, ${currentOpacity})`; // Dark gray stars for light theme

        ctx.fillStyle = starColor;
        ctx.beginPath();
        ctx.moveTo(0, -star.size);
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(
            Math.cos(((Math.PI * 2) / 5) * i) * star.size,
            -Math.sin(((Math.PI * 2) / 5) * i) * star.size
          );
          ctx.lineTo(
            Math.cos(((Math.PI * 2) / 5) * (i + 0.5)) * (star.size * 0.5),
            -Math.sin(((Math.PI * 2) / 5) * (i + 0.5)) * (star.size * 0.5)
          );
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}
