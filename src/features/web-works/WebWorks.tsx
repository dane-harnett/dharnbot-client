import React, { useState } from "react";
import { useMessage } from "../../messages/useMessage";

const WebWorks = () => {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);

  useMessage((event: any) => {
    if (event.message.message.toLowerCase() === "!webworks") {
      setCurrentPhoto("webworks01.png");
    }
    setTimeout(() => {
      setCurrentPhoto(null);
    }, 3000);
  }, []);

  if (currentPhoto === null) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <img src={`/${currentPhoto}`} alt="" />
      </div>
    </div>
  );
};
export default WebWorks;
