import React from "react";
import Grid from "./components/grid";
import { useState } from "react";
import { CirclePicker } from "react-color";

const makeGrid = (size) => {
  return Array(size)
    .fill()
    .map((_) => Array(size).fill("#61daf9"));
};

function App() {
  const [grid, setGrid] = useState(makeGrid(30));
  const [color, setColor] = useState("");

  const update = (x, y) => {
    let newGrid = [...grid];
    newGrid[y][x] = color;
    setGrid(newGrid);
  };

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
