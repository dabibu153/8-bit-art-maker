import React, { useState, useEffect } from "react";
import Grid from "./components/grid";
import Axios from "axios";
let api2 = process.env.REACT_APP_BACKEND_URL;

const Preview = (props) => {
  const [grid, setGrid] = useState([]);
  const [bgcolor, setbgcolor] = useState("");

  useEffect(() => {
    let data = { canvasId: props.match.params.id };
    Axios.post(`${api2}/api/canvasGet`, data).then((res) => {
      console.log(res.data);
      setGrid([...res.data.canvas]);
      setbgcolor(res.data.bgcolor);
    });
  }, []);

  return (
    <div className="secondColumn">
      <Grid grid={grid} bg_col={bgcolor} update={() => false} />
    </div>
  );
};

export default Preview;
