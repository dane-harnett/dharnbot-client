import React, { useEffect, useState } from "react";
import { formatDuration, intervalToDuration } from "date-fns";
import styled from "styled-components";

const Label = styled.div`
  box-sizing: border-box;
  width: 400px;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  position: fixed;
  display: flex;
  align-items: center;
  bottom: 0;
  padding: 4px;
`;

const Countdown = () => {
  const [remaining, setRemaining] = useState("");
  const targetDate = new Date(2020, 7, 29, 15);
  useEffect(() => {
    setInterval(() => {
      const currentDate = new Date();
      const duration = intervalToDuration({
        start: currentDate,
        end: targetDate,
      });
      setRemaining(formatDuration(duration));
    }, 500);
  }, [setRemaining, targetDate]);
  return <Label>End of stream in {remaining}</Label>;
};

export default Countdown;
