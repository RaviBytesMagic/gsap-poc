import "./App.css";

import DepthCarousal from "./DepthCarousal";
import LeftAlignedCarousal from "./DepthCarousal/LeftAlignedCarousal";
import DiagonalCarousel from "./DiagonalCarousal";

function App() {
  return (
    <div className="App">
      <LeftAlignedCarousal />
      <DepthCarousal />
      <DiagonalCarousel />
    </div>
  );
}

export default App;
