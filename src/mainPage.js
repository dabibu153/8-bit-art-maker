import React, { useRef } from "react";
import Grid from "./components/grid";
import { useState, useEffect } from "react";
// AlphaPicker BlockPicker ChromePicker CirclePicker CompactPicker
// GithubPicker HuePicker MaterialPicker PhotoshopPicker
// SketchPicker SliderPicker SwatchesPicker TwitterPicker
import { SketchPicker, BlockPicker, ChromePicker } from "react-color";
import axios from "axios";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { useCopy } from "./customhook/custom";
import {
  AiOutlineRotateLeft,
  AiOutlineRotateRight,
  AiOutlineDownload,
} from "react-icons/ai";
import { CgEditFlipH, CgEditFlipV } from "react-icons/cg";
import { MdGridOn, MdGridOff } from "react-icons/md";

function MainPage(props) {
  const makeGrid = (size) => {
    return Array(size)
      .fill()
      .map((_) => Array(size).fill(""));
  };

  const [grid, setGrid] = useState(makeGrid(40));
  const [color, setColor] = useState("#FF0000");
  const [userName, setUserName] = useState("");
  const [canvasList, setcanvasList] = useState([]);
  const [canvasListName, setcanvasListName] = useState([]);
  const [bgcolor, setbgcolor] = useState([]);
  const [tobeSavedName, settobeSavedName] = useState("");
  const [message, setmessage] = useState("");
  const [thatDudesCanvas, setthatDudesCanvas] = useState("");
  const [canvasLink, setcanvasLink] = useState("");
  const [margin, setmargin] = useState(false);

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
      setbgcolor([...res.data.bgcolor]);
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

  const [canvasColor, setCanvasColor] = useState("#61daf9");
  // let setCanvasColor = (color) => {
  //   let fresh_canvas = Array(40)
  //     .fill()
  //     .map((_) => Array(40).fill(color));

  //   setGrid([...fresh_canvas]);
  // };

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
      bgcolor: canvasColor,
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
  const [copied, copy, reset] = useCopy(canvasLink);

  const handleLinkShare = async (e) => {
    console.log(bgcolor);

    let data = {
      sentCanvasShare: [...canvasList[e.target.value]],
      bgcolor: bgcolor[e.target.value],
    };
    await axios
      .post("http://localhost:5000/api/canvasShare", data)
      .then((res) => {
        console.log(res.data);
        setcanvasLink(`http://${window.location.host}/preview/${res.data._id}`);
      });
  };

  useEffect(() => {
    console.log(canvasLink);
    copy();
  }, [canvasLink]);

  const handlethatDudesCanvas = () => {
    let data = { canvasId: thatDudesCanvas };
    axios.post("http://localhost:5000/api/canvasGet", data).then((res) => {
      console.log(res.data);
      setGrid([...res.data.canvas]);
    });
  };

  return (
    <div id="mainPage" className="mainPage py-3">
      <div className="row flex-column mb-5">
        <header className="m-auto h2 text-center d-block">
          Hi, {userName}
        </header>
        <span className="m-auto headingbottom2 text-muted">{message}</span>
      </div>

      <div className="row">
        <div className="col-4 d-flex flex-row p-3 border border-dark rounded justify-content-center align-items-center">
          <div className="mb-3  mr-2 d-flex flex-column">
            <p className="ccpth nowrap">Bg Color</p>
            <div className="color-picker">
              <ChromePicker
                width="200px"
                disableAlpha={true}
                color={canvasColor}
                onChange={(color) => setCanvasColor(color.hex)}
              />
            </div>
          </div>
          <div className="mb-3 d-flex flex-column">
            <p className="ccpth nowrap">Paint Color</p>
            <div className="color-picker">
              <ChromePicker
                width="200px"
                disableAlpha={true}
                color={color}
                onChange={(color) => setColor(color.hex)}
              />
            </div>
          </div>
        </div>
        <div className="col-4 px-2">
          <div className="row  justify-content-around no-gutters mb-1">
            <button
              className="canvaseditbuttons rounded d-flex justify-content-center"
              onClick={() => rotateAntiClockwise()}
            >
              <AiOutlineRotateLeft />
            </button>
            <button
              className="canvaseditbuttons rounded d-flex justify-content-center"
              onClick={() => rotateClockwise()}
            >
              <AiOutlineRotateRight />
            </button>
            <button
              className="canvaseditbuttons rounded d-flex justify-content-center"
              onClick={() => horizontalFlip()}
            >
              <CgEditFlipH />
            </button>
            <button
              className="canvaseditbuttons rounded d-flex justify-content-center"
              onClick={() => verticalFlip()}
            >
              <CgEditFlipV />
            </button>
            <button
              className="canvaseditbuttons rounded d-flex justify-content-center"
              onClick={() => handleCanvasDownload()}
            >
              <AiOutlineDownload />
            </button>
            <button
              className="canvaseditbuttons rounded d-flex justify-content-center"
              onClick={() => setmargin(!margin)}
            >
              {margin ? <MdGridOff /> : <MdGridOn />}
            </button>
          </div>

          <div className="row  justify-content-center no-gutters">
            <div className={`${!margin && "nomargin"}`} ref={canvasDom}>
              <Grid grid={grid} update={update} bg_col={canvasColor} />
            </div>
          </div>
        </div>

        <div className="col-4 p-3 border border-dark rounded">
          <div className="border border-dark rounded px-1 py-2">
            <div className="form form-inline">
              <input
                className="mx-2 w-200"
                placeholder="Share key.."
                type="text"
                value={thatDudesCanvas}
                onChange={(e) => setthatDudesCanvas(e.target.value)}
              ></input>
              <button className="mx-2" onClick={handlethatDudesCanvas}>
                Load!
              </button>
            </div>
          </div>
          <div className="border border-dark rounded px-1 py-2 mt-2">
            <p className="ccpth">Your saved Art!</p>
            {canvasListName?.length === 0 && (
              <span className="text-muted text-small small text-center d-block">
                No Art saved yet :({" "}
              </span>
            )}
            <ul>
              {canvasListName.map((canvasData, index) => (
                <li>
                  <button
                    className="mx-2 w-200"
                    value={index}
                    onClick={(e) => {
                      handleUserDefinedCanvas(e);
                    }}
                  >
                    {canvasData}
                  </button>
                  <button
                    className="shareButton mx-2"
                    value={index}
                    onClick={(e) => handleLinkShare(e)}
                  >
                    SHARE!
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-dark rounded p-3 mt-2 ">
            <p className="ccpth">Convert Image to 8-bit!</p>

            <input type="file" onChange={onUpload} title="aaa" id="file1" />
            <div className="label1">
              <label htmlFor="file1" className="btn m-0 w-100">
                Upload Image
              </label>
            </div>
          </div>
          <div className="border border-dark rounded p-3 mt-2">
            <div className="form form-inline">
              <input
                className="w-200 mx-2"
                placeholder="Art name!"
                type="text"
                value={tobeSavedName}
                onChange={(e) => settobeSavedName(e.target.value)}
              ></input>
              <button className="mx-2" onClick={(e) => handleCanvasSave(e)}>
                Save!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
