import * as React from "react";
import { useEffect, useState } from "react";

import { useSocket } from "../hooks/useSocket";
import MessageContext from "./MessageContext";

type Callback = (event: any) => void;

const MessageProvider: React.FC = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Callback[]>([]);
  const socket = useSocket();

  useEffect(() => {
    socket.on("MESSAGE", (event: any) => {
      subscriptions.forEach((callback: Callback) => {
        callback(event);
      });
    });
    return () => {
      socket.removeListener("MESSAGE");
    };
    // eslint-disable-next-line
  }, [subscriptions]);

  return (
    <MessageContext.Provider
      value={{
        subscribe: (callback) => {
          setSubscriptions((currentSubscriptions: Callback[]) => {
            return [...currentSubscriptions, callback];
          });
        },
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
