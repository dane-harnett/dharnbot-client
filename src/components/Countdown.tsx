import React, { useEffect, useState } from "react";
import { formatDuration, intervalToDuration } from "date-fns";

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
  return (
    <div
      style={{
        boxSizing: "border-box",
        width: 400,
        backgroundColor: "rgba(0,0,0,0.75)",
        color: "#fff",
        position: "fixed",
        display: "flex",
        alignItems: "center",
        bottom: 0,
        padding: 4,
      }}
    >
      End of stream in {remaining}
    </div>
  );
};

export default Countdown;
