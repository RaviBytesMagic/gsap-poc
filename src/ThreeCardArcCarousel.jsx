import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { gsap } from "gsap";
import "./Carousal.css";

const items = [
  { id: 1, title: "Card 1" },
  { id: 2, title: "Card 2" },
  { id: 3, title: "Card 3" },
  { id: 4, title: "Card 4" },
  { id: 5, title: "Card 5" },
];
const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#845EC2", "#FF9671"];

export default function ThreeCardArcCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const cardRefs = useRef([]);
  const cardWidth = 350; // horizontal distance

  const radius = 360; // radius of the circle
  const angleStep = Math.PI / 5.5; // spacing between cards

  // Offset to push arc into view
  const verticalOffset = 300; // tune this based on viewport

  // Flexible visible count (show n cards on left/right)
  const visibleCount = 2; // show 2 prev + 2 next (total 5 visible)

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - activeIndex;

      // Wrap-around for infinite carousel behavior
      if (offset < -Math.floor(items.length / 2)) offset += items.length;
      if (offset > Math.floor(items.length / 2)) offset -= items.length;

      // Compute base angle and drag effect
      const dragAngle = (-dragX / cardWidth) * angleStep;
      const baseAngle = offset * angleStep - Math.PI / 2;
      const angle = baseAngle + dragAngle;

      const isVisible = Math.abs(offset) <= visibleCount;

      // Compute target positions
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle) + verticalOffset;
      const rotation = angle * (180 / Math.PI) + 90;

      if (!isVisible) {
        // 🚫 Hide card completely, move it far left/right (offscreen)
        const exitX =
          offset > 0 ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
        gsap.to(card, {
          x: exitX,
          y,
          opacity: 0,
          scale: 0.5,
          zIndex: 0,
          duration: 0.4,
          ease: "power3.in",
        });
        return;
      }

      // Visible cards get proper arc animation
      const scale =
        offset === 0 ? 1 : 1 - Math.min(Math.abs(offset) * 0.1, 0.3);

      const shadowScale = scale;
      const bgColor = colors[index % colors.length];

      gsap.to(card, {
        x,
        y,
        rotation,
        scale,
        opacity: 1,
        zIndex: offset === 0 ? 10 : 5,
        duration: dragX ? 0 : 0.4,
        ease: dragX ? "none" : "power3.out",
        transformOrigin: "center center",
        backgroundColor: bgColor,
        boxShadow: `0 ${20 * shadowScale}px ${
          30 * shadowScale
        }px rgba(0,0,0,0.3)`,
      });
    });
  }, [activeIndex, dragX]);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  const handlers = useSwipeable({
    onSwiping: ({ deltaX }) => setDragX(-deltaX), // invert drag
    onSwiped: ({ deltaX, velocity }) => {
      const speed = Math.abs(velocity);
      const threshold = 0.5;
      const distanceThreshold = 50;

      if (deltaX < -distanceThreshold || (deltaX < 0 && speed > threshold)) {
        goNext();
      } else if (
        deltaX > distanceThreshold ||
        (deltaX > 0 && speed > threshold)
      ) {
        goPrev();
      }

      setDragX(0);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div className="carousel-container" {...handlers}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="carousel-card"
          ref={(el) => (cardRefs.current[index] = el)}
        >
          {item.title}
        </div>
      ))}

      <button className="nav-btn prev" onClick={goPrev}>
        ◀
      </button>
      <button className="nav-btn next" onClick={goNext}>
        ▶
      </button>
    </div>
  );
}
