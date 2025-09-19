import React from "react";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import Carousel from "./Carousal";

const items = [
  {
    id: 1,
    img: image1,
    text: "Slide 1",
    title: "Hala welcome tp Diriyah",
    description: "The soul of Saudi",
  },
  {
    id: 2,
    img: image2,
    text: "Slide 2",
    title: "At-Turaif a sanctuary of dreams",
    description: "Journey to the heart of Saudi heritage",
  },
  {
    id: 3,
    img: image3,
    text: "Slide 3",
    title: "Bab Samhan Hotel",
    description: "Saudi heritage on display at Bab samhan Hotel",
  },
];

export default function DiagonalCarousel() {
  return <Carousel items={items} />;
}
