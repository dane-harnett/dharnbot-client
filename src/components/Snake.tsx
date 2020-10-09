import React, { useEffect, useReducer, useState } from "react";
import { useSocket } from "../hooks/useSocket";
//import styled from "styled-components";

const CELL_SIZE = 20;
const CANVAS_WIDTH = 1920 / CELL_SIZE;
const CANVAS_HEIGHT = 1080 / CELL_SIZE;
const DIRECTIONS = ["up", "down", "left", "right"];

const getRandomItem = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

const initialState = {
  snakes: [],
};
const reducer = (state: any, action: any) => {
  if (
    action.type === "MESSAGE" &&
    action.payload.commandData.message.message === "!snake"
  ) {
    const userSnake = state.snakes.find(
      (snake: any) => snake.user.login === action.payload.commandData.user.login
    );
    if (userSnake) {
      return state;
    }
    return {
      ...state,
      snakes: [
        ...state.snakes,
        {
          user: action.payload.commandData.user,
          direction: getRandomItem(DIRECTIONS),
          x: Math.floor(Math.random() * CANVAS_WIDTH),
          y: Math.floor(Math.random() * CANVAS_HEIGHT),
        },
      ],
    };
  }
  if (action.type === "TICK") {
    return {
      ...state,
      snakes: state.snakes.map((current: any) => {
        const possibleDirections = DIRECTIONS.filter((d) => {
          if (current.direction === "up" && d === "down") {
            return false;
          }
          if (current.direction === "down" && d === "up") {
            return false;
          }
          if (current.direction === "left" && d === "right") {
            return false;
          }
          if (current.direction === "right" && d === "left") {
            return false;
          }
          return true;
        }).filter((d) => {
          if (d === "left" && current.x === 0) {
            return false;
          }
          if (d === "up" && current.y === 0) {
            return false;
          }
          if (d === "down" && current.y === CANVAS_HEIGHT - 1) {
            return false;
          }
          if (d === "right" && current.x === CANVAS_WIDTH - 1) {
            return false;
          }
          return true;
        });
        const direction = getRandomItem(possibleDirections);

        if (direction === "up") {
          return { ...current, direction, y: current.y - 1 };
        } else if (direction === "down") {
          return { ...current, direction, y: current.y + 1 };
        } else if (direction === "left") {
          return { ...current, direction, x: current.x - 1 };
        } else {
          return { ...current, direction, x: current.x + 1 };
        }
      }),
    };
  }
  return state;
};

const Snake = ({ backgroundColor = "palevioletred" }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socket = useSocket();

  useEffect(() => {
    socket.on("MESSAGE", (event: any) => {
      dispatch({
        type: "MESSAGE",
        payload: {
          commandData: event,
        },
      });
    });
  });
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 250);
    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      {state.snakes.map((snake: any) => (
        <div
          style={{
            left: snake.x * CELL_SIZE,
            top: snake.y * CELL_SIZE,
            position: "fixed",
            backgroundColor,
            width: CELL_SIZE,
            height: CELL_SIZE,
            zIndex: 10,
            backgroundImage: `url(${snake.user.profile_image_url})`,
            backgroundSize: "cover",
          }}
        />
      ))}
    </div>
  );
};

export default Snake;
