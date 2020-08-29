import React from "react";

import ChatCommand from "./ChatCommand";
import InfoPanel from "./InfoPanel";

export default function InfoPanels() {
  return (
    <div>
      <InfoPanel title="!project">
        Im building a twitch chatbot with commands to integrate with OBS, games
        and more. Ill be using TypeScript, Express and Jest.
      </InfoPanel>
      <InfoPanel title="!today">
        Today I'm working on doing a thing and then doing another thing.
      </InfoPanel>
      <InfoPanel title="!socials">
        <ChatCommand command="!twitter" /> - for a link to my twitter account
        <br />
        <ChatCommand command="!youtube" /> - for a link to my youtube channel
      </InfoPanel>
      <InfoPanel title="!cam">
        Control my webcam:
        <br />
        <ChatCommand command="!cam [on|off]" />
        <br />
        <ChatCommand command="!cam [top-left|top-right|bottom-left|bottom-right]" />
        <br />
        <ChatCommand command="!cam zoom [100%|150%|200%]" />
      </InfoPanel>
      <InfoPanel title="!youdoneyet">
        You Done Yet is a habit tracker app I'm building.
        <br />
        <ChatCommand command="!youdoneyet repo" /> - for a link to the github
        repo
        <br />
        <ChatCommand command="!youdoneyet app" /> - for a link to the app
      </InfoPanel>
      <InfoPanel title="!dharnbot">
        dharnbot is a twitch chatbot I'm building.
        <br />
        <ChatCommand command="!dharnbot repo" /> - for the github repo
      </InfoPanel>
    </div>
  );
}
