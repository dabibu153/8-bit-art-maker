import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";

let api = process.env.REACT_APP_BACKEND_URL;

export default function Landing(props) {
  const [userName, setuserName] = useState("dabibuaa");
  const [message, setMessage] = useState("");
  const [toMainPage, setToMainPage] = useState(false);

  const handleSignIn = () => {
    if (!userName) {
      alert("Enter username first");
      return;
    }
    let data = { userName: userName };

    axios.post(`${api}/api/userName`, data).then((res) => {
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
      <div className="container my-5 pt-2 text-center">
        <h2 className="heading">{"[ 8-bit-art-generator ]"}</h2>
      </div>
      <div className="landingInst border border-dark rounded p-2 bg-light">
        <span className="d-block px-2 my-3">
          <span className="text-danger pr-2"> 1&gt;</span>Login/Sign Up here
          with a unique name.
        </span>
        <span className="d-block px-2 my-3">
          <span className="text-danger pr-2"> 2&gt;</span>Generate pixel art
          from scratch.
        </span>
        <span className="d-block px-2 my-3">
          <span className="text-danger pr-2"> 3&gt;</span>Or convert an image to
          pixel art.
        </span>
        <span className="d-block px-2 my-3">
          <span className="text-danger pr-2"> 4&gt;</span>Share/Download your
          pixel art.
        </span>
      </div>
      <div className="form form-inline">
        <input
          className="rounded mx-2 w-200 px-2"
          placeholder="Username"
          value={userName}
          onChange={(e) => setuserName(e.target.value)}
          type="text"
          min={6}
        ></input>
        <button className="rounded mx-2" onClick={() => handleSignIn()}>
          Log in
        </button>
      </div>
      <div className="message">{message}</div>
    </div>
  );
}
