import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSocket } from "../hooks/useSocket";

interface HighlightedMessageEvent {
  message: {
    context: {
      id: string;
    };
    message: string;
  };
  user: {
    display_name: string;
    description: string;
    profile_image_url: string;
  };
}

interface QueuedMessage {
  event: HighlightedMessageEvent;
}

const HIGHLIGHTED_MESSAGE_EXPIRY = 7500;

const HighlightedMessageUi = styled.div`
  background-color: #212121;
  border: 3px solid #e91530;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  justify-content: space-between;
  width: 640px;
  position: absolute;
  right: 0;
  top: 60px;
`;

function HighlightedMessage({
  onExpire,
  messageDetails,
}: {
  onExpire: () => void;
  messageDetails: HighlightedMessageEvent;
}) {
  useEffect(() => {
    setTimeout(() => {
      onExpire();
    }, HIGHLIGHTED_MESSAGE_EXPIRY);
  }, []);
  return (
    <HighlightedMessageUi>
      <div style={{ padding: 4, width: 128 + 8 }}>
        <img
          src={messageDetails.user.profile_image_url}
          style={{ width: 128, height: 128 }}
        />
      </div>
      <div style={{ padding: 4, width: "calc(100% - 136px)" }}>
        <div style={{ fontWeight: "bold" }}>
          {messageDetails.user.display_name}
        </div>
        <div style={{ wordWrap: "break-word" }}>
          {messageDetails.message.message}
        </div>
      </div>
    </HighlightedMessageUi>
  );
}

export default function HighlightedMessages() {
  const [msgQ, setMsgQ] = useState<QueuedMessage[]>([]);
  const socket = useSocket();

  useEffect(() => {
    socket.on("HIGHLIGHTED_MESSAGE", (event: HighlightedMessageEvent) => {
      setMsgQ((prevMsgQ) => {
        return prevMsgQ.concat([{ event }]);
      });
    });
  }, [socket]);

  const onExpire = () => {
    setMsgQ((prevMsgQ) => {
      return prevMsgQ.slice(1);
    });
  };

  return msgQ.length > 0 ? (
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
      <HighlightedMessage
        key={msgQ[0].event.message.context.id}
        onExpire={onExpire}
        messageDetails={msgQ[0].event}
      />
    </div>
  ) : null;
}
