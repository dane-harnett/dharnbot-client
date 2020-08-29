import React from "react";
import styled from "styled-components";

const StyledChatCommand = styled.span`
  background-color: #7b2529;
  border-radius: 4px;
  color: #f0deba;
  display: inline-block;
  padding: 4px;
  margintop: 4px;
`;

interface ChatCommandProps {
  command: string;
}

const ChatCommand = ({ command }: ChatCommandProps) => {
  return <StyledChatCommand>{command}</StyledChatCommand>;
};

export default ChatCommand;
