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

  const [grid, setGrid] = useState(makeGrid(40));
  const [color, setColor] = useState("#61daf9");
  const [userName, setUserName] = useState("");
  const [canvasList, setcanvasList] = useState([]);
  const [canvasListName, setcanvasListName] = useState([]);
  const [tobeSavedName, settobeSavedName] = useState("");
  const [message, setmessage] = useState("_");
  const [thatDudesCanvas, setthatDudesCanvas] = useState("");
  const [canvasLink, setcanvasLink] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    let data = { userName: props.match.params.userName };
    axios.post("http://localhost:5000/api/userData", data).then((res) => {
      console.log("incoming user", res.data);
      setUserName(res.data.userName);
      setcanvasList([...res.data.canvas]);
      setcanvasListName([...res.data.canvasName]);
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
    for (let i = 0; i < 20; i++) {
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
      for (let j = 0; j < 20; j++) {
        let temp = new_grid[i][j];
        new_grid[i][j] = new_grid[i][new_grid.length - 1 - j];
        new_grid[i][new_grid.length - 1 - j] = temp;
      }
    }
    setGrid(new_grid);
  };

  let setCanvasColor = (color) => {
    let fresh_canvas = Array(40)
      .fill()
      .map((_) => Array(40).fill(color));

    setGrid([...fresh_canvas]);
  };

  const handleUserDefinedCanvas = (e) => {
    setGrid([...canvasList[e.target.value]]);
  };

  const handleCanvasSave = (e) => {
    e.preventDefault();

    if (tobeSavedName === "") {
      setmessage("please enter canvas name before saving");
      return;
    }
    let data = {
      userName: userName,
      sentCanvas: grid,
      sentCanvasName: tobeSavedName,
    };
    axios.put("http://localhost:5000/api/canvasSave", data).then((res) => {
      refreshData();
      setmessage("_");
      settobeSavedName("");
    });
  };

  const handleCanvasDownload = () => {
    if (!canvasDom.current) {
      return 0;
    }
    var node = canvasDom.current;
    domtoimage.toBlob(node).then(function (blob) {
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
    for (let i = 0; i < 20; i++) {
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
          canvas.width = 40;
          canvas.height = 40;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 40, 40);
          const pixelData = ctx.getImageData(0, 0, 40, 40).data;

          let newCanvasData = [];
          for (let index = 0; index < pixelData.length; index += 4) {
            let r = pixelData[index];
            let g = pixelData[index + 1];
            let b = pixelData[index + 2];

            newCanvasData.push(rgbToHex(r, g, b));
          }
          console.log(newCanvasData);

          let newCanvas = Array(40)
            .fill("")
            .map((e, i) => {
              return newCanvasData.slice(i * 40, i * 40 + 40);
            });
          console.log("newcanvas", newCanvas);

          setGrid(horizontalFlipExtra(rotateClockwiseExtra(newCanvas)));

          console.log(pixelData);
        };
      };
      fr.readAsDataURL(files[0]);
    }
  };

  const handleLinkShare = async (e) => {
    let data = { sentCanvasShare: [...canvasList[e.target.value]] };
    await axios
      .post("http://localhost:5000/api/canvasShare", data)
      .then((res) => {
        console.log(res.data);
        setcanvasLink(res.data._id);
      });
  };

  useEffect(() => {
    setmessage(`copy this and share to distribute your art :- ${canvasLink}`);
  }, [canvasLink]);

  const handlethatDudesCanvas = () => {
    let data = { canvasId: thatDudesCanvas };
    axios.post("http://localhost:5000/api/canvasGet", data).then((res) => {
      console.log(res.data);
      setGrid([...res.data.canvas]);
    });
  };

  return (
    <div id="mainPage" className="mainPage">
      <div className="topRow">
        <div className="headingtop">---hello there---</div>
        <div className="headingbottom">{userName}</div>
        <div className="headingbottom2">{message}</div>
      </div>
      <div className="middleRow">
        <div className="thirdColumn">
          <div className="userDefinedDesigns">
            <p className="ccpth">here is the stuff you Saved !</p>
            <ul>
              {canvasListName.map((canvasData, index) => (
                <li>
                  <button
                    value={index}
                    onClick={(e) => {
                      handleUserDefinedCanvas(e);
                    }}
                  >
                    {canvasData}
                  </button>
                  <button
                    className="shareButton"
                    value={index}
                    onClick={(e) => handleLinkShare(e)}
                  >
                    SHARE!
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="imageUpload">
            <div>
              <input type="file" onChange={onUpload} title="aaa" id="file1" />
              <div className="label1">
                <label htmlFor="file1">upload</label>
              </div>
            </div>
          </div>
          <div className="saveandDownloadCanvas">
            <p className="ccpth extra">save/download your creation </p>
            <div className="saveDwnloadButtons">
              <input
                type="text"
                value={tobeSavedName}
                onChange={(e) => settobeSavedName(e.target.value)}
              ></input>
              <button onClick={(e) => handleCanvasSave(e)}>SAVE!</button>

              <button onClick={() => handleCanvasDownload()}>DOWNLOAD!</button>
            </div>
          </div>
        </div>
        <div className="firstColumn">
          <div className="canvasColorPicker">
            <p className="ccpth">Choose base color for your canvas</p>
            <BlockPicker
              color={color}
              onChange={(color) => setCanvasColor(color.hex)}
            />
            <p className="ccpth" style={{ color: "#ff6347" }}>
              warning: this WILL reset your canvas
            </p>
          </div>
          <div className="colorpicker">
            <p className="ccpth">Choose the color u want to paint with</p>
            <CirclePicker
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
            />
          </div>
        </div>
        <div ref={canvasDom} className="secondColumn">
          <Grid grid={grid} update={update} />
        </div>
      </div>
      <div className="bottomContent">
        <div className="canvasEdits">
          <p className="ccpth extra">mess around with the canvas : </p>

          <button onClick={() => rotateAntiClockwise()}>Anticlockwise</button>
          <button onClick={() => rotateClockwise()}>clockwise</button>
          <button onClick={() => horizontalFlip()}>Horizontal Flip</button>
          <button onClick={() => verticalFlip()}>vertical Flip</button>
        </div>
        <div className="thatDudesCanvas">
          <input
            type="text"
            value={thatDudesCanvas}
            onChange={(e) => setthatDudesCanvas(e.target.value)}
          ></input>
          <button onClick={handlethatDudesCanvas}>Get Canves</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
