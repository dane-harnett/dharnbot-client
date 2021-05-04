import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  background-color: ${(props: { username: string }) =>
    props.username === "daneharnett"
      ? "rgba(123, 37, 41, 0.75)"
      : "rgba(0, 0, 0, 0.75)"};
  color: #fff;
  marginbottom: 2px;
  padding: 4px;
`;

const ChatAvatarUsername = ({ username }: { username: string }) => {
  return <StyledDiv username={username}>{username}</StyledDiv>;
};

export default ChatAvatarUsername;
