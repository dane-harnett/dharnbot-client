import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import TwitterIcon from "@material-ui/icons/Twitter";
import YouTubeIcon from "@material-ui/icons/YouTube";

const Label = styled.div`
  box-sizing: border-box;
  width: 400px;
  background-color: #7b2529;
  color: #f0deba;
  position: fixed;
  display: flex;
  align-items: center;
  bottom: 225px;
  padding: 4px;
`;

const Socials = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setCurrent(current === 0 ? 1 : 0);
    }, 5000);
  }, []);
  return (
    <AnimatePresence>
      {current === 0 && (
        <motion.div
          key={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Label>
            <TwitterIcon /> /daneharnett{" "}
          </Label>
        </motion.div>
      )}
      {current === 1 && (
        <motion.div
          key={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Label>
            <YouTubeIcon /> /user/daneharnett{" "}
          </Label>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Socials;
