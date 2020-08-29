import React, { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

const ChatAvatarCountdown = ({ targetDate }: { targetDate: Date }) => {
  const [remaining, setRemaining] = useState(60);
  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      const duration = differenceInSeconds(targetDate, currentDate);
      setRemaining(duration);
    }, 500);
    return () => clearInterval(timer);
  }, [setRemaining, targetDate]);

  const percentRemaining = (remaining / 60) * 100;
  return (
    <div
      style={{
        display: "block",
        backgroundColor:
          percentRemaining > 65
            ? "rgb(64,143,73)"
            : percentRemaining > 25
            ? "rgb(241,195,67)"
            : "rgb(201,57,43)",
        width: `${percentRemaining}%`,
        height: 10,
      }}
    ></div>
  );
};

export default ChatAvatarCountdown;
