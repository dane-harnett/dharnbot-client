import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSocket } from "../hooks/useSocket";

const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  padding: 6px;
`;

export default function TwitchFollowerCount() {
  const socket = useSocket();
  const [followerCount, setFollowerCount] = useState<number>(0);

  useEffect(() => {
    socket.on(
      "TWITCH_FOLLOWER_COUNT_RESPONSE",
      (event: { followerCount: number }) => {
        setFollowerCount(event.followerCount);
      }
    );

    socket.emit("TWITCH_FOLLOWER_COUNT_REQUEST");
    const FIVE_MINUTES = 300000;
    setInterval(() => {
      socket.emit("TWITCH_FOLLOWER_COUNT_REQUEST");
    }, FIVE_MINUTES);
  }, [socket]);

  return <Container>Dane has {followerCount} followers!</Container>;
}
