import React, { useState, useEffect } from "react";
import Grid from "./components/grid";
import Axios from "axios";

const Preview = (props) => {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    let data = { canvasId: props.match.params.id };
    Axios.post("http://localhost:5000/api/canvasGet", data).then((res) => {
      console.log(res.data);
      setGrid([...res.data.canvas]);
    });
  }, []);

  return (
    <div className="secondColumn">
      <Grid grid={grid} update={() => false} />
    </div>
  );
};

export default Preview;
