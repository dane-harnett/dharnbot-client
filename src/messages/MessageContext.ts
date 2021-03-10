import React from "react";

interface MessageContextValue {
  subscribe: (callback: (event: any) => void) => void;
}
const MessageContext = React.createContext<MessageContextValue>({
  subscribe: () => {},
});

export default MessageContext;
