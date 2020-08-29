import React, { useEffect, useState } from "react";
import { formatDuration, intervalToDuration } from "date-fns";
import styled from "styled-components";

const Label = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.75);
  bottom: 0;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  padding: 4px;
  position: fixed;
  width: 400px;
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
      setRemaining(
        formatDuration(duration)
          .replace(" hours", "h")
          .replace(" hour", "h")
          .replace(" minutes", "m")
          .replace(" minute", "m")
          .replace(" seconds", "s")
          .replace(" second", "s")
      );
    }, 500);
  }, [setRemaining, targetDate]);
  return <Label>End of stream in {remaining}</Label>;
};

export default Countdown;
