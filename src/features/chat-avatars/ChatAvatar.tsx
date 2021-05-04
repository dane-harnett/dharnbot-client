import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { add } from "date-fns";
import ChatAvatarCountdown from "./ChatAvatarCountdown";
import ChatAvatarUsername from "./ChatAvatarUsername";

interface ChatAvatarProps {
  user: {
    username: string;
    profile_image_url: string;
  };
  movement: {
    distance: number;
  };
  lastMessageDate: Date;
}

const ChatAvatar = ({ user, movement, lastMessageDate }: ChatAvatarProps) => {
  const [currentX, setCurrentX] = useState(25);
  const [movementLocked, setMovementLocked] = useState(false);
  const [direction, setDirection] = useState("right");

  const spinTransition = {
    rotate: {
      duration: 4,
      loop: Infinity,
      ease: "linear",
    },
  };

  const bounceTransition = {
    y: {
      duration: 0.4,
      yoyo: Infinity,
      ease: "easeIn",
    },
  };

  const moveTransition = {
    x: {
      duration: 4,
    },
  };

  useEffect(() => {
    let currentDirection = direction;
    if (movementLocked) {
    } else {
      if (currentX >= 1920 - 56) {
        currentDirection = "left";
        setDirection("left");
      }
      if (currentX <= 0) {
        currentDirection = "right";
        setDirection("right");
      }

      if (currentDirection === "right") {
        if (currentX + movement.distance >= 1920 - 56) {
          setCurrentX(1920 - 56);
          setMovementLocked(true);
        } else {
          setCurrentX(currentX + movement.distance);
        }
      } else {
        if (currentX - movement.distance <= 0) {
          setCurrentX(0);
          setMovementLocked(true);
        } else {
          setCurrentX(currentX - movement.distance);
        }
      }
    }
    // depending on all the state causes undesired re-executions
    // eslint-disable-next-line
  }, [movement, movementLocked]);

  return (
    <div>
      <motion.div
        transition={moveTransition}
        animate={{
          x: currentX,
        }}
        onAnimationComplete={() => {
          if (movementLocked) {
            setMovementLocked(false);
          }
        }}
        style={{ position: "fixed", bottom: 0 }}
      >
        <motion.div
          transition={bounceTransition}
          animate={{ y: ["-50%", "0%"] }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ChatAvatarCountdown
              targetDate={add(lastMessageDate, { seconds: 60 })}
            />
            <ChatAvatarUsername username={user.username} />
            <motion.div
              transition={spinTransition}
              animate={{
                rotate: direction === "right" ? 360 : -360,
              }}
              style={{ width: 56 }}
            >
              <div
                style={{
                  backgroundColor:
                    user.username === "daneharnett"
                      ? "#7b2529"
                      : "mediumseagreen",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: 56,
                  height: 56,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    overflow: "hidden",
                  }}
                >
                  <img
                    alt={user.username}
                    style={{ width: 48, height: 48 }}
                    src={user.profile_image_url}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChatAvatar;
