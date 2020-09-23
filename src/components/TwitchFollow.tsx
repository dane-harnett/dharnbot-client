import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import BookmarksIcon from "@material-ui/icons/Bookmarks";

const Notification = styled.div`
  align-items: center;
  background-color: #7b2529;
  border-radius: 4px;
  box-sizing: border-box;
  color: #f0deba;
  display: flex;
  font-size: 24px;
  padding: 8px;
`;
const Label = styled.div`
  padding-left: 8px;
`;

const ANIMATION_DURATION = 20;
const ANIMATION_COOLDOWN = 120;

const transition = {
  x: {
    duration: ANIMATION_DURATION,
    ease: "linear",
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: ANIMATION_COOLDOWN,
  },
};
const TwitchFollow = () => {
  return (
    <motion.div
      transition={transition}
      initial={{ x: -400 }}
      animate={{ x: 1920 }}
      style={{ position: "fixed", top: 0, width: 400 }}
    >
      <Notification>
        <BookmarksIcon fontSize="large" />
        <Label>Don't forget to follow if you like what you see.</Label>
      </Notification>
    </motion.div>
  );
};

export default TwitchFollow;
