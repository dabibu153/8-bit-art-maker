import React, { useRef } from "react";
import Grid from "./components/grid";
import { useState, useEffect } from "react";
import { CirclePicker, BlockPicker } from "react-color";
import axios from "axios";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

function MainPage(props) {
  const makeGrid = (size) => {
    return Array(size)
      .fill()
      .map((_) => Array(size).fill("#61daf9"));
  };

  const [grid, setGrid] = useState(makeGrid(30));
  const [color, setColor] = useState("#61daf9");
  const [userName, setUserName] = useState("");
  const [canvasList, setcanvasList] = useState([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    let data = { userName: props.match.params.userName };
    axios.post("http://localhost:5000/api/userData", data).then((res) => {
      console.log("incoming user", res.data);
      setUserName(res.data.userName);
      setcanvasList([...res.data.canvas]);
    });
  };

  const update = (x, y) => {
    console.log(x, y);
    let newGrid = [...grid];
    newGrid[y][x] = color;
    setGrid(newGrid);
  };

  let rotateAntiClockwise = () => {
    console.log(grid);
    let new_grid = [...grid].reverse();
    for (let i = 0; i < new_grid.length; i++) {
      for (let j = i + 0; j < new_grid[i].length; j++) {
        let temp = new_grid[i][j];
        new_grid[i][j] = new_grid[j][i];
        new_grid[j][i] = temp;
      }
    }
    setGrid(new_grid);
  };

  let rotateClockwise = () => {
    let new_grid = [...grid];
    for (let i = 0; i < new_grid.length; i++) {
      for (let j = i + 0; j < new_grid[i].length; j++) {
        let temp = new_grid[i][j];
        new_grid[i][j] = new_grid[j][i];
        new_grid[j][i] = temp;
      }
    }
    let new_new_grid = [...new_grid].reverse();
    setGrid(new_new_grid);
  };

  let horizontalFlip = () => {
    let new_grid = [...grid];
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < new_grid[i].length; j++) {
        let temp = new_grid[i][j];
        new_grid[i][j] = new_grid[new_grid.length - 1 - i][j];
        new_grid[new_grid.length - 1 - i][j] = temp;
      }
    }
    setGrid(new_grid);
  };

  let verticalFlip = () => {
    let new_grid = [...grid];
    for (let i = 0; i < new_grid.length; i++) {
      for (let j = 0; j < 15; j++) {
        let temp = new_grid[i][j];
        new_grid[i][j] = new_grid[i][new_grid.length - 1 - j];
        new_grid[i][new_grid.length - 1 - j] = temp;
      }
    }
    setGrid(new_grid);
  };

  let setCanvasColor = (color) => {
    let fresh_canvas = Array(30)
      .fill()
      .map((_) => Array(30).fill(color));

    setGrid([...fresh_canvas]);
  };

  const handleUserDefinedCanvas = (e) => {
    setGrid([...canvasList[e.target.value]]);
  };

  const handleCanvasSave = () => {
    let data = { userName: userName, sentCanvas: grid };
    axios.put("http://localhost:5000/api/canvasSave", data).then((res) => {
      refreshData();
    });
  };

  const handleCanvasDownload = () => {
    if (!canvasDom.current) {
      return 0;
    }
    var node = canvasDom.current;
    domtoimage.toBlob(node).then(function (blob) {
      // save img
      saveAs(blob, "canvas.png");
    });
  };

  const canvasDom = useRef(null);

  return (
    <div>
      <div className="greeting">hello there, {userName}</div>
      <div className="middleRow">
        <div className="firstColumn">
          <div className="canvasColorPicker">
            <BlockPicker
              color={color}
              onChange={(color) => setCanvasColor(color.hex)}
            />
          </div>
          <div className="colorpicker">
            <CirclePicker
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
            />
          </div>
        </div>
        <div ref={canvasDom} className="secondColumn">
          <Grid grid={grid} update={update} />
        </div>
        <div className="thirdColumn">
          <div className="preDefinedDesigns">
            <ul>
              <li>
                <button>Design 1</button>
              </li>
              <li>
                <button>Design 2</button>
              </li>
              <li>
                <button>Design 3</button>
              </li>
              <li>
                <button>Design 4</button>
              </li>
              <li>
                <button>Design 5</button>
              </li>
            </ul>
          </div>
          <div className="userDefinedDesigns">
            <ul>
              {canvasList.map((canvasData, index) => (
                <li>
                  <button
                    value={index}
                    onClick={(e) => {
                      handleUserDefinedCanvas(e);
                    }}
                  >
                    saved Design {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bottomContent">
        <div className="saveandDownloadCanvas">
          <button onClick={() => handleCanvasSave()}>SAVE!</button>
          <button onClick={() => handleCanvasDownload()}>DOWNLOAD!</button>
        </div>
        <div className="canvasEdits">
          <button onClick={() => rotateAntiClockwise()}>Anticlockwise</button>
          <button onClick={() => rotateClockwise()}>clockwise</button>
          <button onClick={() => horizontalFlip()}>Horizontal Flip</button>
          <button onClick={() => verticalFlip()}>vertical Flip</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;