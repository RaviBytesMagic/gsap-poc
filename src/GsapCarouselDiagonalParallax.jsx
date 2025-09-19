import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSwipeable } from "react-swipeable";

gsap.registerPlugin(useGSAP);

export default function DiagonalParallaxCarousel({
  items = [],
  swipeThreshold = 50,
}) {
  const slidesRef = useRef([]);
  const backgroundImgRef = useRef(null);
  const textRef = useRef(null); // CHANGE: Add ref for text
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    prevDirectionRef.current = "next";
    setCurrent((prev) => (prev + 1) % total);
  };
  const prevSlide = () => {
    prevDirectionRef.current = "prev";
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const prevDirectionRef = useRef(current);

  const total = items.length;
  const animateSlides = ({ deltaX = 0, isDragging = false }) => {
    const direction = prevDirectionRef.current;

    slidesRef.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === current;
      const isPrev = i === (current - 1 + total) % total;
      const isNext = i === (current + 1) % total;

      const common = { duration: isDragging ? 0.1 : 2, ease: "power3.out" };

      if (isActive) {
        gsap.to(el, {
          x: isDragging ? deltaX * 0.5 : 0,
          y: isDragging ? -deltaX * 0.6 : 0,
          xPercent: 0,
          yPercent: 0,
          scale: isDragging ? 1 - Math.abs(deltaX) * 0.001 : 1,
          opacity: 1,
          zIndex: 2,
          ...common,
        });
      } else if (isPrev) {
        if (prevDirectionRef.current === "prev") {
          gsap.from(el, {
            xPercent: -100,
            yPercent: 100,
            scale: 0,
            opacity: 0,
            zIndex: 1,
            ...common,
          });
        }

        gsap.to(el, {
          xPercent: -80,
          x: isDragging ? deltaX * 0.5 : 0,
          yPercent: 85,
          y: isDragging ? -deltaX * 0.9 : 0,

          scale: isDragging ? 0.6 + Math.abs(deltaX) * 0.0009 : 0.6,
          opacity: 0.3,
          zIndex: 1,
          ...common,
        });
      } else if (isNext) {
        if (prevDirectionRef.current === "next") {
          gsap.from(el, {
            xPercent: 100,
            yPercent: -100,

            scale: 0,
            opacity: 0,
            zIndex: 1,
            ...common,
          });
        }

        gsap.to(el, {
          xPercent: 80,
          x: isDragging ? deltaX * 0.5 : 0,
          yPercent: -85,
          y: isDragging ? -deltaX * 0.9 : 0,
          scale: isDragging ? 0.6 + Math.abs(deltaX) * 0.0005 : 0.6,
          opacity: 0.3,
          zIndex: 1,
          ...common,
        });
      } else {
        gsap.to(el, {
          opacity: 0,
          scale: 0,
          zIndex: 0,
          duration: isDragging ? 0.1 : 0.3,
          ease: "power1.out",
        });
      }
    });

    if (!isDragging && backgroundImgRef.current) {
      // ✅ Apply background styles properly
      backgroundImgRef.current.style.backgroundImage = `url(${items[current].img})`;
      backgroundImgRef.current.style.backgroundPosition = `-185px -198.84px`;
      backgroundImgRef.current.style.backgroundSize = `177.436% 140.868%`;
      backgroundImgRef.current.style.backgroundRepeat = `no-repeat`;
      backgroundImgRef.current.style.backgroundColor = `#623C2C`;

      // ✅ Animate only opacity & scale with GSAP
      gsap.fromTo(
        backgroundImgRef.current,
        { opacity: 1, scale: 0.9 },
        {
          opacity: 1,
          scale: 1.3,
          duration: 1,
          delay: -1,
          ease: "power2.out",
        }
      );
    }

    if (!isDragging && textRef.current) {
      const [h1, p] = textRef.current.children;
      h1.textContent = items[current].title;
      p.textContent = items[current].description;
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: direction === "next" ? -50 : 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  };

  useGSAP(() => {
    if (slidesRef.current) {
      gsap.set(slidesRef.current, {
        xPercent: 100,
        yPercent: -100,
        duration: 1,
      });
    }
  }, []);

  // ✅ Trigger on slide change
  useGSAP(() => {
    animateSlides({ isDragging: false });
  }, [current]);

  // ✅ Handle swipe gestures
  const swipeHandlers = useSwipeable({
    onSwiping: ({ deltaX }) => {
      prevDirectionRef.current = "";
      animateSlides({ deltaX, isDragging: true });
    },
    onSwiped: ({ deltaX }) => {
      if (deltaX > swipeThreshold) {
        prevDirectionRef.current = "prev";
        setCurrent((c) => (c - 1 + total) % total);
      } else if (deltaX < -swipeThreshold) {
        prevDirectionRef.current = "next";
        setCurrent((c) => (c + 1) % total);
      } else {
        animateSlides({ isDragging: false }); // reset if swipe not enough
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  return (
    <div style={defaultStyles.outerWrapper} {...swipeHandlers}>
      {/* CHANGE: Add text on the left */}
      <div ref={textRef} style={defaultStyles.textWrapper}>
        <h1></h1>
        <p></p>
        <button style={defaultStyles.exploreButton}>Explore</button>
      </div>

      {/* Background */}
      {/* <div
        ref={bgBottomRef}
        style={{
          ...defaultStyles.background,
          filter: `blur(${blur}px) brightness(0.6)`,
        }}
      /> */}
      <div
        ref={backgroundImgRef}
        style={{
          ...defaultStyles.background,
          opacity: 0,
          backgroundImage: `url(${items[0].img})`,
          // filter: `blur(${blur}px) brightness(0.6)`,
        }}
      />

      {/* Carousel */}
      <div style={defaultStyles.carouselWrapper}>
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => (slidesRef.current[i] = el)}
            style={{
              ...defaultStyles.slide,
              backgroundImage: `url(${item.img})`,
            }}
          ></div>
        ))}
      </div>

      {/* Progress + Controls */}
      <div style={defaultStyles.controlsWrapper}>
        <span style={defaultStyles.currentIndex}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <div style={defaultStyles.progressWrapper}>
          <div
            style={{
              ...defaultStyles.progressBar,
              width: `${((current + 1) / total) * 100}%`,
            }}
          />
        </div>
        <span style={defaultStyles.totalCount}>
          {String(total).padStart(2, "0")}
        </span>
        <button style={defaultStyles.navButton} onClick={prevSlide}>
          &#10094;
        </button>
        <button style={defaultStyles.navButton} onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
}

const defaultStyles = {
  outerWrapper: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    touchAction: "pan-y",
  },
  textWrapper: {
    position: "absolute",
    left: "10%",
    top: "20%",
    color: "#fff",
    zIndex: 10,
    width: "50%",
    textAlign: "left",
  },
  exploreButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    cursor: "pointer",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transformOrigin: "center center",
    zIndex: 0,
    backgroundBlendMode: "multiply, normal",
  },
  carouselWrapper: {
    position: "relative",
    width: "90%",
    maxWidth: "400px",
    height: "55vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  slide: {
    position: "absolute",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "56vw",
    height: "56vh",
    aspectRatio: 218.41 / 317,
  },
  overlay: {
    background: "rgba(0,0,0,0.4)",
    color: "#fff",
    fontSize: "1.5rem",
    padding: "10px 20px",
    borderRadius: "8px",
  },
  controlsWrapper: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#fff",
    fontSize: "1rem",
    zIndex: 10,
  },
  currentIndex: {
    fontWeight: "600",
    fontSize: "1rem",
  },
  progressWrapper: {
    position: "relative",
    width: "100px",
    height: "2px",
    background: "rgba(255,255,255,0.3)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "#fff",
    transition: "width 0.3s ease",
  },
  totalCount: {
    opacity: 0.5,
    fontSize: "1rem",
  },
  navButton: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
};
