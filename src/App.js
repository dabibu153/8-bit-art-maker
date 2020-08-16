import React from "react";
import Grid from "./components/grid";
import { useState } from "react";
import { CirclePicker } from "react-color";

const makeGrid = (size) => {
  return Array(size).fill(Array(size).fill("#61DAF9"));
};

function App() {
  const [grid, setGrid] = useState(makeGrid(30));
  const [color, setColor] = useState("");

  const update = (x, y) => {};

  return (
    <div className="App">
      <Grid grid={grid} update={update} />
      <div className="colorpicker">
        <CirclePicker
          color={color}
          onChangeComplete={(color) => setColor(color.hex)}
        />
      </div>
    </div>
  );
}

export default App;
