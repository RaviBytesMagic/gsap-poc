import "./App.css";

import { DepthCarousal, LeftDepthCarousal } from "./DepthCarousal";
import DiagonalCarousel from "./DiagonalCarousal";

function App() {
  return (
    <div className="App">
      <DiagonalCarousel />
      <DepthCarousal />
      <LeftDepthCarousal />
    </div>
  );
}

export default App;
