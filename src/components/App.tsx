import React from "react";

import InfoPanels from "./InfoPanels";
import Countdown from "./Countdown";
import ChatAvatars from "./ChatAvatars";
import Socials from "./Socials";

function App() {
  return (
    <div className="App">
      <InfoPanels />
      <ChatAvatars />
      <Socials />
      <Countdown />
    </div>
  );
}

export default App;
