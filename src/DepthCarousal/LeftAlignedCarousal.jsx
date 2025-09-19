import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { gsap } from "gsap";
import "./Carousal.css";
import CarouselControls from "../common/CarouselControls";
import { useGSAP } from "@gsap/react";

export default function LeftAlignedCarousal({
  items = [],
  renderItem, // ✅ you will pass (item, index) => JSX
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const cardRefs = useRef([]);
  const prevDirectionRef = useRef("");

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
    const direction = prevDirectionRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - activeIndex;
      if (offset < -Math.floor(items.length / 2)) offset += items.length;
      //   if (offset > Math.floor(items.length / 2)) offset -= items.length;

      const progress = offset - dragFactor;
      const distance = Math.abs(progress);
      const isActive = distance < 0.001;

      // 🔥 Make scaling more dramatic (farther = much smaller)
      const scale = gsap.utils.clamp(0.4, 1.05, 1 - distance * 0.22);

      // Stronger z-axis push for real 3D depth
      const z = isActive ? 300 : 250 - distance * 80;

      // Slightly bigger horizontal translation
      const x = offset > 0 ? progress * 60 : 0;

      // Increase rotation for more dramatic parallax feel
      const rotateY = progress * -18;

      // Opacity fades faster for far cards
      const opacity = distance > 2.5 ? 0 : 1 - distance * 0.35;

      // Stronger blur for non-active cards
      const blurAmount = gsap.utils.clamp(0, 12, distance * 3);
      const filter = isActive ? "blur(0)" : `blur(${blurAmount}px)`;

      if (direction === "prev") {
        gsap.from(card, {
          x: -100,
        });
      }

      gsap.to(card, {
        x: x - 30,
        z,
        scale,
        rotateY,
        opacity,
        filter,
        backgroundImage: items[activeIndex].img,
        zIndex: isActive ? 100 : 90 - distance * 10,
        transformOrigin: "center center",
        duration: dragX ? 0 : 0.5, // slightly slower for more cinematic effect
        ease: dragX ? "none" : "power4.out",
      });
    });
  }, [activeIndex, dragX]);

  const goNext = () => {
    prevDirectionRef.current = "next";
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const goPrev = () => {
    prevDirectionRef.current = "prev";
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            color: "#623C2C",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Visual stories
        </span>
        <span>
          <svg
            width="76"
            height="13"
            viewBox="0 0 76 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M65.4683 1.18214L58.6301 11.3971C58.2308 11.9936 58.6999 12.7554 59.4586 12.7554H73.1351C73.8938 12.7554 74.363 11.9936 73.9637 11.3971L67.1254 1.18214C66.7461 0.613115 65.8576 0.613115 65.4783 1.18214"
              fill="#C79667"
            />
            <path
              d="M36.4693 1.18214L29.631 11.3971C29.2317 11.9936 29.7009 12.7554 30.4596 12.7554H44.1361C44.8948 12.7554 45.364 11.9936 44.9647 11.3971L38.1264 1.18214C37.7471 0.613115 36.8586 0.613115 36.4793 1.18214"
              fill="#C79667"
            />
            <path
              d="M7.48393 1.18214L0.645689 11.3971C0.246376 11.9936 0.715567 12.7554 1.47426 12.7554H15.1507C15.9094 12.7554 16.3786 11.9936 15.9793 11.3971L9.14108 1.18214C8.76173 0.613115 7.87325 0.613115 7.49391 1.18214"
              fill="#C79667"
            />
          </svg>
        </span>
      </div>
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
