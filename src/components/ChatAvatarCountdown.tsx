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
  return (
    <div
      style={{
        display: "block",
        backgroundColor: "palevioletred",
        width: `${(remaining / 60) * 100}%`,
        height: 10,
      }}
    ></div>
  );
};

export default ChatAvatarCountdown;
