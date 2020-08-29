import React, { useEffect, useReducer } from "react";
import ChatAvatar from "./ChatAvatar";
import { useSocket } from "../hooks/useSocket";

interface ICommandData {
  message: {
    context: {
      badges: { broadcaster: "0" | "1" };
      subscriber: boolean;
    };
    message: string;
  };
  user: { login: string; profile_image_url: string };
}

interface IChatAvatar {
  username: string;
  profile_image_url: string;
  movement: {
    distance: number;
  };
  expiryTimer: ReturnType<typeof setTimeout>;
  lastMessageDate: Date;
}

interface State {
  chatAvatars: IChatAvatar[];
}
type MessageAction = {
  type: "MESSAGE";
  payload: {
    commandData: ICommandData;
    expiryTimer: ReturnType<typeof setTimeout>;
  };
};
type Action =
  | MessageAction
  | {
      type: "DESPAWN";
      payload: {
        username: string;
      };
    };

const calculateBoosts = (action: MessageAction) => {
  const context = action.payload.commandData.message.context;

  if (context.badges?.broadcaster === "1") {
    return 3;
  }

  if (context.subscriber) {
    return 2;
  }

  return 1;
};

const calculateDistance = (action: MessageAction) => {
  const segments = action.payload.commandData.message.message.split(" ").length;
  const boosts = calculateBoosts(action);
  return boosts * 100 * (segments > 3 ? 3 : segments);
};

const initialState = { chatAvatars: [] };
function reducer(state: State, action: Action) {
  switch (action.type) {
    case "DESPAWN":
      return {
        ...state,
        chatAvatars: state.chatAvatars.filter(
          (chatAvatar) => chatAvatar.username !== action.payload.username
        ),
      };
    case "MESSAGE":
      if (
        state.chatAvatars.find(
          (chatAvatar) =>
            chatAvatar.username === action.payload.commandData.user.login
        )
      ) {
        return {
          ...state,
          chatAvatars: state.chatAvatars.map((chatAvatar) => {
            if (chatAvatar.username === action.payload.commandData.user.login) {
              clearTimeout(chatAvatar.expiryTimer);
              return {
                ...chatAvatar,
                movement: {
                  distance: calculateDistance(action),
                },
                expiryTimer: action.payload.expiryTimer,
                lastMessageDate: new Date(),
              };
            }
            return chatAvatar;
          }),
        };
      }
      return {
        ...state,
        chatAvatars: [
          ...state.chatAvatars,
          {
            username: action.payload.commandData.user.login,
            profile_image_url:
              action.payload.commandData.user.profile_image_url,
            movement: {
              distance: calculateDistance(action),
            },
            expiryTimer: action.payload.expiryTimer,
            lastMessageDate: new Date(),
          },
        ],
      };
  }
  return state;
}

const ChatAvatars = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socket = useSocket();

  useEffect(() => {
    socket.on("MESSAGE", (event: ICommandData) => {
      dispatch({
        type: "MESSAGE",
        payload: {
          commandData: event,
          expiryTimer: setTimeout(() => {
            dispatch({
              type: "DESPAWN",
              payload: { username: event.user.login },
            });
          }, 60000),
        },
      });
    });
  }, [socket]);

  return (
    <div>
      {state.chatAvatars.map((avatar) => (
        <ChatAvatar
          key={avatar.username}
          user={{
            username: avatar.username,
            profile_image_url: avatar.profile_image_url,
          }}
          movement={avatar.movement}
          lastMessageDate={avatar.lastMessageDate}
        />
      ))}
    </div>
  );
};

export default ChatAvatars;
