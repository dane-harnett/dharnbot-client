import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//import ChatAvatars from "./ChatAvatars";
import Snake from "./Snake";
import Socials from "./Socials";
import AdminScreen from "./AdminScreen";
import TwitchFollow from "./TwitchFollow";

import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}
  @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .overlay {
    width: 1920;
    height: 1080;
    left: 0;
    top: 0;
    position: relative;
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Switch>
        <Route path="/admin">
          <AdminScreen />
        </Route>
        <Route path="/">
          <div className="overlay">
            <Snake />
            <Socials />
            <TwitchFollow />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
