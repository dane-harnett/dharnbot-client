import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MonsterBattle from "../features/monster-battle";
import SnakeGame, { SnakeGameProvider } from "../features/snake";
import MessageProvider from "../messages/MessageProvider";
import AdminScreen from "./AdminScreen";

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
      <MessageProvider>
        <SnakeGameProvider>
          <GlobalStyle />
          <Switch>
            <Route path="/admin">
              <AdminScreen />
            </Route>
            <Route path="/">
              <div className="overlay">
                <MonsterBattle />
                <SnakeGame />
              </div>
            </Route>
          </Switch>
        </SnakeGameProvider>
      </MessageProvider>
    </Router>
  );
}

export default App;
