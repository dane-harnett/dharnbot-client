import React from "react";

import InfoPanels from "./InfoPanels";
import Countdown from "./Countdown";
import ChatAvatars from "./ChatAvatars";

function App() {
  return (
    <div className="App">
      <InfoPanels />
      <ChatAvatars />
      <Countdown />
    </div>
  );
}

export default App;
