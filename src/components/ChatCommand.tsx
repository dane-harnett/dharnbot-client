import React from "react";

interface ChatCommandProps {
  command: string;
}

const ChatCommand = ({ command }: ChatCommandProps) => {
  return (
    <span
      style={{
        backgroundColor: "#7b2529",
        borderRadius: "4px",
        color: "#f0deba",
        display: "inline-block",
        padding: "4px",
        marginTop: "4px",
      }}
    >
      {command}
    </span>
  );
};

export default ChatCommand;
