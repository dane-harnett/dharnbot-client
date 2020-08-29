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

const Socials = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((current) => (current === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
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
