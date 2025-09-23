import React from "react";
import Carousal from "./Carousal";

import diriyahNightsImage from "./assets/diriyahNights.png";
import hikingImage from "./assets/hiking.png";
import coffeeTourImage from "./assets/coffee.png";
import najdiDiningImage from "./assets/najdi.png";
import atTuraifImage from "./assets/atturaif.png";
import LeftAlignedCarousal from "./LeftAlignedCarousal";

const items = [
  {
    id: 1,
    img: diriyahNightsImage,
    title: "Diriyah nights",
  },
  {
    id: 2,
    img: hikingImage,
    title: "Hiking adventure outdoors",
  },
  {
    id: 3,
    img: coffeeTourImage,
    title: "Coffee & dates tasting tour",
  },
  {
    id: 4,
    img: najdiDiningImage,
    title: "Najdi dining at Bujairi Terrace",
  },
  {
    id: 5,
    img: atTuraifImage,
    title: "At turaif UNESCO",
  },
];
// Sa

export const LeftDepthCarousal = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        height: "497px",
        paddingTop: "55px",
        paddingBottom: "55px",
      }}
    >
      <LeftAlignedCarousal
        items={items}
        renderItem={(item, index, isActive) => (
          <div
            style={{
              width: "238px",
              height: "100%",
              padding: "1rem",
              borderRadius: "12px",
              color: "#fff",
              textAlign: "center",
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "4px",

              boxShadow: "13px 17px 32.1px 0 rgba(0, 0, 0, 0.45)",

              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              display: "flex",
              alignItems: "end",
              justifyContent: "start",
            }}
          >
            <span
              style={{
                color: "#FFF",

                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              {item.title}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export const DepthCarousal = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        height: "497px",
        paddingTop: "55px",
        paddingBottom: "55px",
      }}
    >
      <Carousal
        items={items}
        renderItem={(item, index, isActive) => (
          <div
            style={{
              width: "238px",
              height: "100%",
              padding: "1rem",
              borderRadius: "12px",
              color: "#fff",
              textAlign: "center",
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "4px",

              boxShadow: "13px 17px 32.1px 0 rgba(0, 0, 0, 0.45)",

              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              display: "flex",
              alignItems: "end",
              justifyContent: "start",
            }}
          >
            <span
              style={{
                color: "#FFF",

                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              {item.title}
            </span>
          </div>
        )}
      />
    </div>
  );
};
