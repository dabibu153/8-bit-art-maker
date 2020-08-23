import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";
import Landing from "./landing";
import MainPage from "./mainPage";
import Preview from "./Preview";

export default function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact component={(props) => <Landing {...props} />} />
          <Route path="/mainPage/:userName" component={MainPage} />
          <Route path="/preview/:id" component={Preview} />
        </Switch>
      </Router>
    </div>
  );
}
