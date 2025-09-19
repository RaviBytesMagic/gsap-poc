import React from "react";

export default function CarouselControls({
  current = 0,
  total = 1,
  onPrev,
  onNext,
  styles = {},
}) {
  // Default minimal styling (can be overridden via props)
  const defaultStyles = {
    controlsWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      justifyContent: "center",
      marginTop: "12px",
      fontFamily: "sans-serif",
    },
    currentIndex: {
      fontWeight: "400",
      fontSize: "12px",
    },
    progressWrapper: {
      position: "relative",
      width: "100px",
      height: "1px",
      borderRadius: "2px",
      overflow: "hidden",
      background: "#623c2c33",
    },
    progressBar: {
      height: "100%",
      background: "#623C2C",
      transition: "width 0.3s ease",
    },
    totalCount: {
      fontWeight: "400",
      fontSize: "12px",
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

  return (
    <div
      style={{ ...defaultStyles.controlsWrapper, ...styles.controlsWrapper }}
    >
      {/* Current Index */}
      <span style={{ ...defaultStyles.currentIndex, ...styles.currentIndex }}>
        {String(current + 1).padStart(2, "0")}
      </span>

      {/* Progress Bar */}
      <div
        style={{ ...defaultStyles.progressWrapper, ...styles.progressWrapper }}
      >
        <div
          style={{
            ...defaultStyles.progressBar,
            ...styles.progressBar,
            width: `${((current + 1) / total) * 100}%`,
          }}
        />
      </div>

      {/* Total */}
      <span
        style={{
          ...defaultStyles.totalCount,
          ...styles.totalCount,
          opacity: current === total - 1 ? 1 : 0.3,
        }}
      >
        {String(total).padStart(2, "0")}
      </span>

      {/* Navigation */}
      <button
        style={{ ...defaultStyles.navButton, ...styles.navButton }}
        onClick={onPrev}
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button
        style={{ ...defaultStyles.navButton, ...styles.navButton }}
        onClick={onNext}
        aria-label="Next Slide"
      >
        &#10095;
      </button>
    </div>
  );
}
