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

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  let rotateClockwiseExtra = (grid1) => {
    let new_grid = [...grid1];
    for (let i = 0; i < new_grid.length; i++) {
      for (let j = i + 0; j < new_grid[i].length; j++) {
        let temp = new_grid[i][j];
        new_grid[i][j] = new_grid[j][i];
        new_grid[j][i] = temp;
      }
    }
    let new_new_grid = [...new_grid].reverse();
    return new_new_grid;
  };

  let horizontalFlipExtra = (grid2) => {
    let new_grid = [...grid2];
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < new_grid[i].length; j++) {
        let temp = new_grid[i][j];
        new_grid[i][j] = new_grid[new_grid.length - 1 - i][j];
        new_grid[new_grid.length - 1 - i][j] = temp;
      }
    }
    return new_grid;
  };

  const onUpload = (e) => {
    const files = e.target.files;
    console.log(e.target.files);
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        let imageElm = document.createElement("img");
        imageElm.src = fr.result;
        imageElm.onload = (e) => {
          console.log("img loadeded");
          const img = e.target;
          var canvas = document.createElement("canvas");
          canvas.width = 30;
          canvas.height = 30;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 30, 30);
          const pixelData = ctx.getImageData(0, 0, 30, 30).data;

          let newCanvasData = [];
          for (let index = 0; index < pixelData.length; index += 4) {
            let r = pixelData[index];
            let g = pixelData[index + 1];
            let b = pixelData[index + 2];

            newCanvasData.push(rgbToHex(r, g, b));
          }
          console.log(newCanvasData);

          let newCanvas = Array(30)
            .fill("")
            .map((e, i) => {
              return newCanvasData.slice(i * 30, i * 30 + 30);
            });
          console.log("newcanvas", newCanvas);

          setGrid(horizontalFlipExtra(rotateClockwiseExtra(newCanvas)));

          console.log(pixelData);
        };
      };
      fr.readAsDataURL(files[0]);
    }
    // setimage(picture[0]);
    // setimage(URL.createObjectURL(picture[0]));
  };

  return (
    <div id="mainPage" className="mainPage">
      <div className="topRow">
        <div className="headingtop">---hello there---</div>
        <div className="headingbottom">{userName}</div>
      </div>
      <div className="middleRow">
        <div className="firstColumn">
          <div className="canvasColorPicker">
            <p className="ccpth">
              Use this to choose base color for your canvas
            </p>
            <BlockPicker
              color={color}
              onChange={(color) => setCanvasColor(color.hex)}
            />
            <p className="ccpth">warning: using this WILL reset your canvas</p>
          </div>
          <div className="colorpicker">
            <p className="ccpth">
              Use this to choose the color u want to paint with
            </p>
            <CirclePicker
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
            />
            <p className="ccpth">and no, this one doesn't reset your canvas</p>
          </div>
        </div>
        <div ref={canvasDom} className="secondColumn">
          <Grid grid={grid} update={update} />
        </div>
        <div className="thirdColumn">
          <div className="preDefinedDesigns">
            <p className="ccpth">PRE-made designs for u to use</p>
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
            <p className="ccpth">here is the stuff you Saved !</p>
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
          <p className="ccpth extra">save and download your creation : </p>

          <button onClick={() => handleCanvasSave()}>SAVE!</button>
          <button onClick={() => handleCanvasDownload()}>DOWNLOAD!</button>
        </div>
        <div className="canvasEdits">
          <p className="ccpth extra">mess around with the canvas : </p>

          <button onClick={() => rotateAntiClockwise()}>Anticlockwise</button>
          <button onClick={() => rotateClockwise()}>clockwise</button>
          <button onClick={() => horizontalFlip()}>Horizontal Flip</button>
          <button onClick={() => verticalFlip()}>vertical Flip</button>
        </div>
      </div>
      <div className="imageUpload">
        <div>
          <input type="file" onChange={onUpload} />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
