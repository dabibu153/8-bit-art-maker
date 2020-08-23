import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";

export default function Landing(props) {
  const [userName, setuserName] = useState("dabibuaa");
  const [message, setMessage] = useState("");
  const [toMainPage, setToMainPage] = useState(false);

  const handleSignIn = () => {
    let data = { userName: userName };

    axios.post("http://localhost:5000/api/userName", data).then((res) => {
      if (res.data === "bad input for login") {
        setMessage(res.data);
        return;
      }
      setMessage(res.data);
      setTimeout(() => {
        setToMainPage(true);
      }, 2500);
    });
  };
  return (
    <div className="landingMain">
      {toMainPage ? <Redirect to={`/mainPage/${userName}`} /> : null}
      <div className="headingtop2">~~8-bit-art~~</div>
      <div className="landingInst">
        <ul>
          <li>Login/signUp here with a unique UserName</li>
          <br></br>
          <li>You can save/download/share your canvas</li>
          <br></br>
          <li>You can generate a pixel art from any image</li>
        </ul>
      </div>
      <form>
        <label className="label2">username</label>
        <input
          className="userLogin"
          placeholder="your special name"
          value={userName}
          onChange={(e) => setuserName(e.target.value)}
          type="text"
          min={6}
        ></input>
      </form>
      <button className="loginsubmit" onClick={() => handleSignIn()}>
        submit
      </button>
      <div className="message">{message}</div>
    </div>
  );
}
