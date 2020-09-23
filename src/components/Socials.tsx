import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import TwitterIcon from "@material-ui/icons/Twitter";
import YouTubeIcon from "@material-ui/icons/YouTube";

const Label = styled.div`
  align-items: center;
  background-color: #7b2529;
  bottom: 225px;
  box-sizing: border-box;
  color: #f0deba;
  display: flex;
  font-size: 24px;
  padding: 4px;
  position: fixed;
  width: 400px;
`;

const items = [
  () => (
    <Label>
      <TwitterIcon /> /daneharnett
    </Label>
  ),
  () => (
    <Label>
      <YouTubeIcon /> /user/daneharnett
    </Label>
  ),
];

const Socials = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((current) =>
        current + 1 > items.length - 1 ? 0 : current + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <AnimatePresence>
      <motion.div
        key={current}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {items[current]()}
      </motion.div>
    </AnimatePresence>
  );
};

export default Socials;
