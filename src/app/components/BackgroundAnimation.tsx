"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

// Define interfaces for the different shape types
interface Circle {
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

interface Square {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
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

    // Shape particles for clean glassmorphism design
    const circles: Circle[] = [];
    const squares: Square[] = [];

    // Glassmorphism color palette
    const lightColors = [
      "rgba(165, 180, 252, 0.2)", // Indigo
      "rgba(253, 224, 71, 0.2)", // Yellow
      "rgba(74, 222, 128, 0.2)", // Green
      "rgba(248, 113, 113, 0.2)", // Red
      "rgba(192, 132, 252, 0.2)", // Purple
    ];

    const darkColors = [
      "rgba(96, 165, 250, 0.2)", // Blue
      "rgba(251, 191, 36, 0.2)", // Amber
      "rgba(16, 185, 129, 0.2)", // Emerald
      "rgba(239, 68, 68, 0.2)", // Red
      "rgba(139, 92, 246, 0.2)", // Violet
    ];

    // Create 8 circles with glassmorphism effect
    for (let i = 0; i < 8; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 20,
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: (Math.random() - 0.5) * 0.7,
        opacity: Math.random() * 0.3 + 0.1,
        color:
          theme === "dark"
            ? darkColors[Math.floor(Math.random() * darkColors.length)]
            : lightColors[Math.floor(Math.random() * lightColors.length)],
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // Create 6 squares with glassmorphism effect
    for (let i = 0; i < 6; i++) {
      squares.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 50 + 30,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.25 + 0.1,
        color:
          theme === "dark"
            ? darkColors[Math.floor(Math.random() * darkColors.length)]
            : lightColors[Math.floor(Math.random() * lightColors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    let animationFrameId: number;

    const draw = () => {
      if (!ctx) return;

      // Clear canvas with theme-appropriate subtle background
      ctx.fillStyle =
        theme === "dark"
          ? "rgba(15, 23, 42, 0.03)"
          : "rgba(248, 250, 252, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circles with glassmorphism effect
      circles.forEach((circle) => {
        // Pulsing effect
        circle.radius += circle.pulseDirection * circle.pulseSpeed;
        if (circle.radius > 60 || circle.radius < 20) {
          circle.pulseDirection *= -1;
        }

        // Move circle
        circle.x += circle.speedX;
        circle.y += circle.speedY;

        // Bounce off edges
        if (
          circle.x < circle.radius ||
          circle.x > canvas.width - circle.radius
        ) {
          circle.speedX *= -1;
        }
        if (
          circle.y < circle.radius ||
          circle.y > canvas.height - circle.radius
        ) {
          circle.speedY *= -1;
        }

        // Draw circle with glass effect
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);

        // Create glassmorphism gradient
        const gradient = ctx.createRadialGradient(
          circle.x - circle.radius * 0.3,
          circle.y - circle.radius * 0.3,
          0,
          circle.x,
          circle.y,
          circle.radius
        );
        gradient.addColorStop(0, circle.color.replace(/[\d\.]+\)$/, "0.4)"));
        gradient.addColorStop(1, circle.color.replace(/[\d\.]+\)$/, "0.1)"));

        ctx.fillStyle = gradient;
        ctx.fill();

        // Add subtle border
        ctx.strokeStyle = circle.color.replace(/[\d\.]+\)$/, "0.2)");
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw squares with glassmorphism effect and rotation
      squares.forEach((square) => {
        // Rotate square
        square.rotation += square.rotationSpeed;

        // Move square
        square.x += square.speedX;
        square.y += square.speedY;

        // Bounce off edges
        if (square.x < square.size || square.x > canvas.width - square.size) {
          square.speedX *= -1;
        }
        if (square.y < square.size || square.y > canvas.height - square.size) {
          square.speedY *= -1;
        }

        // Draw rotated square
        ctx.save();
        ctx.translate(square.x, square.y);
        ctx.rotate(square.rotation);

        // Create glassmorphism gradient for square
        const gradient = ctx.createLinearGradient(
          -square.size / 2,
          -square.size / 2,
          square.size / 2,
          square.size / 2
        );
        gradient.addColorStop(0, square.color.replace(/[\d\.]+\)$/, "0.3)"));
        gradient.addColorStop(1, square.color.replace(/[\d\.]+\)$/, "0.1)"));

        ctx.fillStyle = gradient;
        ctx.fillRect(
          -square.size / 2,
          -square.size / 2,
          square.size,
          square.size
        );

        // Add subtle border
        ctx.strokeStyle = square.color.replace(/[\d\.]+\)$/, "0.2)");
        ctx.lineWidth = 1;
        ctx.strokeRect(
          -square.size / 2,
          -square.size / 2,
          square.size,
          square.size
        );

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
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
}
