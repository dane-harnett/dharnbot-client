import React from "react";
import { useMachine } from "@xstate/react";
import { useMessage } from "../../messages/useMessage";
import machine from "./state-machine/machine";

const WebWorks = () => {
  const [current, send] = useMachine(machine);

  useMessage(({ message }) => {
    if (message.message.toLowerCase().indexOf("!webworks") === 0) {
      send("ACTIVATE");
    }
  }, []);

  if (current.matches("idle")) {
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
        <img src={`/webworks01.png`} alt="" />
      </div>
    </div>
  );
};
export default WebWorks;
