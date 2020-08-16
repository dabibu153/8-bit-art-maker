import React from "react";

export default function Rows(props) {
  return (
    <div>
      {props.row.map((pixel, index) => (
        <div
          className="pixels"
          key={index}
          style={{ backgroundColor: pixel }}
          onClick={() => props.update(index, props.rownumber)}
        />
      ))}
    </div>
  );
}
