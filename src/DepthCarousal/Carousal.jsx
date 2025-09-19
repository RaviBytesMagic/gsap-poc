import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { gsap } from "gsap";
import "./Carousal.css";
import CarouselControls from "../common/CarouselControls";
import { useGSAP } from "@gsap/react";

export default function Carousal({
  items = [],
  renderItem, // ✅ you will pass (item, index) => JSX
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const cardRefs = useRef([]);

  const [cardWidth, setCardWidth] = useState(220);

  useEffect(() => {
    function handleResize() {
      if (cardRefs.current[0]) {
        setCardWidth(cardRefs.current[0].offsetWidth);
      }
    }

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    const dragFactor = dragX / cardWidth;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - activeIndex;
      if (offset < -Math.floor(items.length / 2)) offset += items.length;
      if (offset > Math.floor(items.length / 2)) offset -= items.length;

      const progress = offset - dragFactor;
      const distance = Math.abs(progress);

      const isActive = distance < 0.001;

      // 🔥 Progressive scaling: farther cards are smaller
      const scale = gsap.utils.clamp(0, 1, 1 - distance * 0.15);

      // Push non-active cards behind progressively
      const z = isActive ? 300 : 250 - distance * 50;

      // Slight horizontal offset so next/prev peek in
      const x = progress * 40;

      // Slight rotation for depth realism
      const rotateY = progress * -10;

      // Opacity fades out for very far cards
      const opacity = distance > 3 ? 0 : 1 - distance * 0.2;

      const filter = isActive ? "blur(0)" : `blur(${offset * (offset - 1)}px)`;

      gsap.to(card, {
        x,
        z,
        scale,
        rotateY,
        opacity,
        filter,
        backgroundImage: items[activeIndex].img,
        zIndex: isActive ? 100 : 90 - distance * 5,
        transformOrigin: "center center",
        duration: dragX ? 0 : 0.35,
        ease: dragX ? "none" : "power3.out",
      });
    });
  }, [activeIndex, dragX]);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % items.length);

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  const handlers = useSwipeable({
    onSwiping: ({ deltaX }) => setDragX(-deltaX),
    onSwiped: ({ deltaX, velocity }) => {
      const speed = Math.abs(velocity);
      const threshold = 0.5;
      const distanceThreshold = 80;

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
    <>
      <div className="carousel-container" {...handlers}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className="carousel-card"
            ref={(el) => (cardRefs.current[index] = el)}
          >
            {renderItem ? renderItem(item, index, activeIndex === index) : item}
          </div>
        ))}
      </div>
      <CarouselControls
        onPrev={goPrev}
        onNext={goNext}
        current={activeIndex}
        total={items.length}
        styles={{
          currentIndex: {
            color: "#000",
          },
          progressBar: {
            color: "#000",
            background: "#623C2C",
          },
          navButton: {
            color: "#98724F",
            border: "1px solid rgba(0, 0, 0, 0.20)",
          },
          totalCount: {
            color: "#000",
          },
        }}
      />
    </>
  );
}
