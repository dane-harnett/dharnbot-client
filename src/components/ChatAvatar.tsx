import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ChatAvatarProps {
  user: {
    username: string;
    profile_image_url: string;
  };
  movement: {
    distance: number;
  };
}

const ChatAvatar = ({ user, movement }: ChatAvatarProps) => {
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
          animate={{ y: [-96, -46] }}
          style={{ position: "absolute" }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.75)",
              color: "#fff",
              padding: 4,
              position: "absolute",
              top: -30,
            }}
          >
            <div>{user.username}</div>
          </div>
          <motion.div
            transition={spinTransition}
            animate={{
              rotate: direction === "right" ? 360 : -360,
            }}
            style={{ position: "absolute", top: 0 }}
          >
            <div
              style={{
                backgroundColor: "mediumseagreen",
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChatAvatar;
