import React, { useState } from "react";
import Rows from "./row";

export default function Grid(props) {
  const [dragging, setDragging] = useState(false);
  return (
    <div
      className="grid1"
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
    >
      {props.grid.map((row, index) => (
        <Rows
          key={index}
          row={row}
          rownumber={index}
          update={props.update}
          dragging={dragging}
        />
      ))}
    </div>
  );
}
