import React, { useCallback, useEffect, useRef, useState } from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useSocket } from "../hooks/useSocket";

const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  gap: 6px;
  padding: 6px;
`;
const Item = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
`;

enum Displays {
  CallToAction,
  CountAndGoal,
  LatestFollower,
}
const DisplayNext = {
  [Displays.CallToAction]: Displays.LatestFollower,
  [Displays.CountAndGoal]: Displays.CallToAction,
  [Displays.LatestFollower]: Displays.CountAndGoal,
};
const DisplayDuration = {
  [Displays.CallToAction]: 40_000,
  [Displays.CountAndGoal]: 10_000,
  [Displays.LatestFollower]: 10_000,
};

export default function TwitchFollowerCount() {
  const socket = useSocket();
  const [current, setCurrent] = useState(Displays.CountAndGoal);
  const timeOutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const setTimer = useCallback((destination: Displays) => {
    timeOutRef.current = setTimeout(() => {
      setCurrent(destination);
      setTimer(DisplayNext[destination]);
    }, DisplayDuration[destination]);
  }, []);
  useEffect(() => {
    setTimer(Displays.CallToAction);
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, [setTimer]);

  const [followerCount, setFollowerCount] = useState<number>(0);
  const [latestFollower, setLatestFollower] = useState<string>("");
  const followerRanges = [
    10,
    50,
    100,
    200,
    300,
    500,
    1000,
    2000,
    3000,
    5000,
    10000,
    // When I have > 10K followers, then I'll fill this out further.
  ];

  const followerGoal =
    followerRanges.find((fr) => {
      return followerCount <= fr;
    }) || followerCount + 1;

  useEffect(() => {
    socket.on(
      "TWITCH_FOLLOWER_COUNT_RESPONSE",
      (event: {
        followerCount: number;
        latestFollower: { from_name: string };
      }) => {
        setFollowerCount(event.followerCount);
        setLatestFollower(event.latestFollower.from_name);
      }
    );

    socket.emit("TWITCH_FOLLOWER_COUNT_REQUEST");
    const FIVE_MINUTES = 300000;
    setInterval(() => {
      socket.emit("TWITCH_FOLLOWER_COUNT_REQUEST");
    }, FIVE_MINUTES);
  }, [socket]);

  return (
    <Container>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {current === Displays.CountAndGoal && (
            <Item>
              <FavoriteIcon htmlColor="rgb(169, 112, 255)" />
              {followerCount}/{followerGoal}{" "}
            </Item>
          )}
          {current === Displays.CallToAction && (
            <Item>
              <FavoriteIcon htmlColor="rgb(169, 112, 255)" />
              Click the follow button!
            </Item>
          )}
          {current === Displays.LatestFollower && (
            <Item>Latest follower: {latestFollower}</Item>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
