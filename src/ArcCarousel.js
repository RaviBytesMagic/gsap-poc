import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useSwipeable } from "react-swipeable";
import "./ArcCarousel.css"; // Import the CSS file

const items = [
  { id: 1, title: "Card 1" },
  { id: 2, title: "Card 2" },
  { id: 3, title: "Card 3" },
  { id: 4, title: "Card 4" },
  { id: 5, title: "Card 5" },
];

export default function ArcCarousel() {
  const [current, setCurrent] = useState(0);
  const cardRefs = useRef([]);
  const visibleCount = 3; // Number of visible cards
  const radius = 150; // Adjusted for half-circle arc
  const angleStep = Math.PI / (visibleCount - 1);

  const updatePositions = () => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const offset = index - current;
      if (
        offset < -Math.floor(visibleCount / 2) ||
        offset > Math.floor(visibleCount / 2)
      ) {
        gsap.to(card, { opacity: 0, duration: 0.5 });
        return;
      }
      const angle = angleStep * offset - Math.PI / 2;
      const y = radius * Math.cos(angle);
      const x = radius * Math.sin(angle);

      gsap.to(card, {
        x,
        y,
        // rotation: angle * (180 / Math.PI),
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      });
    });
  };

  useEffect(() => {
    updatePositions();
  }, [current]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrent((prev) => (prev + 1) % items.length),
    onSwipedRight: () =>
      setCurrent((prev) => (prev - 1 + items.length) % items.length),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="carousel-wrapper" {...swipeHandlers}>
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => (cardRefs.current[index] = el)}
          className="carousel-card"
        >
          {item.title}
        </div>
      ))}
      <div className="navigation">
        <button
          onClick={() =>
            setCurrent((prev) => (prev - 1 + items.length) % items.length)
          }
        >
          ◀
        </button>
        <button onClick={() => setCurrent((prev) => (prev + 1) % items.length)}>
          ▶
        </button>
      </div>
    </div>
  );
}
