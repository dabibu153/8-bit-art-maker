import React from "react";
import Rows from "./row";

export default function Grid(props) {
  return (
    <div className="grid1">
      {props.grid.map((row, index) => (
        <Rows row={row} rownumber={index} update={props.update} />
      ))}
    </div>
  );
}
