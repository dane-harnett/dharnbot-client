import React, { useEffect, useReducer, useState } from "react";
import { useMessage } from "../../messages/useMessage";
import SnakeGameContext from "./SnakeGameContext";

interface Cell {
  x: number;
  y: number;
}

const CELL_SIZE = 30;
const CANVAS_WIDTH = 1920 / CELL_SIZE;
const CANVAS_HEIGHT = 1080 / CELL_SIZE;
const DIRECTIONS = ["up", "down", "left", "right"];
const TICK_DURATION = 50;
const TICK_FOOD_SPAWN_COUNT = 1000 / TICK_DURATION;

const getRandomItem = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

const initialState = {
  foodSpawnTickCount: 0,
  food: [],
  snakes: [],
};

const isDontReverseDirectionEnabled = true;
const dontReverseDirection = (current: any) => (d: string) => {
  if (!isDontReverseDirectionEnabled) {
    return true;
  }
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
};
const isDontWrapAroundEnabled = false;
const dontWrapAround = (current: any) => (d: string) => {
  if (!isDontWrapAroundEnabled) {
    return true;
  }
  if (d === "left" && current.cells[0].x === 0) {
    return false;
  }
  if (d === "up" && current.cells[0].y === 0) {
    return false;
  }
  if (d === "down" && current.cells[0].y === CANVAS_HEIGHT - 1) {
    return false;
  }
  if (d === "right" && current.cells[0].x === CANVAS_WIDTH - 1) {
    return false;
  }
  return true;
};

const dontRunIntoAnotherSnake = (current: any, snakes: any[]) => (
  d: "up" | "down" | "left" | "right"
) => {
  const headCell: Cell = current.cells[0];

  const movement: { up: Cell; down: Cell; left: Cell; right: Cell } = {
    up: {
      x: headCell.x,
      y: headCell.y === 0 ? CANVAS_HEIGHT - 1 : headCell.y - 1,
    },
    down: {
      x: headCell.x,
      y: headCell.y === CANVAS_HEIGHT - 1 ? 0 : headCell.y + 1,
    },
    left: {
      x: headCell.x === 0 ? CANVAS_WIDTH - 1 : headCell.x - 1,
      y: headCell.y,
    },
    right: {
      x: headCell.x === CANVAS_WIDTH - 1 ? 0 : headCell.x + 1,
      y: headCell.y,
    },
  };

  const newHead = movement[d];

  const isAnotherSnakeInDirection = !!snakes.find((snake: any) => {
    if (snake.user.login === current.user.login) {
      return false;
    }
    return snake.cells.find((cell: any) => {
      return cell.x === newHead.x && cell.y === newHead.y;
    });
  });

  return !isAnotherSnakeInDirection;
};

const reducer = (state: any, action: any) => {
  if (
    action.type === "MESSAGE" &&
    (action.payload.commandData.message.context.badges?.broadcaster === "1" ||
      action.payload.commandData.message.context.mod) &&
    action.payload.commandData.message.message.indexOf("!snake remove") === 0
  ) {
    const usernameSnakeToRemove = action.payload.commandData.message.message.replace(
      "!snake remove ",
      ""
    );
    const newSnakes = state.snakes.filter((snake: any) => {
      return !(
        snake.user.login.toLowerCase() === usernameSnakeToRemove.toLowerCase()
      );
    });
    return {
      ...state,
      snakes: newSnakes,
    };
  }
  if (
    action.type === "MESSAGE" &&
    action.payload.commandData.message.message === "!snake fast"
  ) {
    let newSnakes = [...state.snakes];

    for (let i = 0; i < newSnakes.length; i++) {
      if (newSnakes[i].user.login === action.payload.commandData.user.login) {
        newSnakes[i].speed = 1;
      }
    }
    return {
      ...state,
      snakes: newSnakes,
    };
  }

  if (
    action.type === "MESSAGE" &&
    action.payload.commandData.message.message === "!snake medium"
  ) {
    let newSnakes = [...state.snakes];

    for (let i = 0; i < newSnakes.length; i++) {
      if (newSnakes[i].user.login === action.payload.commandData.user.login) {
        newSnakes[i].speed = 2;
      }
    }
    return {
      ...state,
      snakes: newSnakes,
    };
  }

  if (
    action.type === "MESSAGE" &&
    action.payload.commandData.message.message === "!snake slow"
  ) {
    let newSnakes = [...state.snakes];

    for (let i = 0; i < newSnakes.length; i++) {
      if (newSnakes[i].user.login === action.payload.commandData.user.login) {
        newSnakes[i].speed = 3;
      }
    }
    return {
      ...state,
      snakes: newSnakes,
    };
  }

  if (
    action.type === "MESSAGE" &&
    action.payload.commandData.message.message === "!snake"
  ) {
    const userSnakes = state.snakes.filter(
      (snake: any) => snake.user.login === action.payload.commandData.user.login
    );
    if (userSnakes.length > 0) {
      return state;
    }

    const direction = getRandomItem(DIRECTIONS);
    const headCell: Cell = {
      x: Math.floor(Math.random() * CANVAS_WIDTH),
      y: Math.floor(Math.random() * CANVAS_HEIGHT),
    };
    return {
      ...state,
      snakes: [
        ...state.snakes,
        {
          user: action.payload.commandData.user,
          isAlive: true,
          direction,
          cells: [headCell],
          tickCount: 0,
          speed: 2,
        },
      ],
    };
  }
  if (action.type === "TICK") {
    let newFood = [...state.food];
    let newSnakes = [...state.snakes];

    for (let i = 0; i < newSnakes.length; i++) {
      const current = newSnakes[i];

      if (newSnakes[i].speed > newSnakes[i].tickCount) {
        newSnakes[i].tickCount += 1;
      } else {
        const possibleDirections = [
          current.direction,
          current.direction,
          ...DIRECTIONS,
        ]
          .filter(dontReverseDirection(current))
          .filter(dontWrapAround(current))
          .filter(dontRunIntoAnotherSnake(current, newSnakes));

        // if there is food in the current.direction
        //and we can continue in that direction
        // then continue in that direction

        const isFoodInCurrentDirection = !!state.food.find((food: any) => {
          if (current.direction === "up" || current.direction === "down") {
            return food.x === current.cells[0].x;
          }
          if (current.direction === "left" || current.direction === "right") {
            return food.y === current.cells[0].y;
          }
          return false;
        });

        let direction = getRandomItem(possibleDirections);
        if (
          isFoodInCurrentDirection &&
          possibleDirections.includes(current.direction)
        ) {
          direction = current.direction;
        }

        const headCell: Cell = current.cells[0];
        let newCells: Cell[] = [];

        const movement: { up: Cell; down: Cell; left: Cell; right: Cell } = {
          up: {
            x: headCell.x,
            y: headCell.y === 0 ? CANVAS_HEIGHT - 1 : headCell.y - 1,
          },
          down: {
            x: headCell.x,
            y: headCell.y === CANVAS_HEIGHT - 1 ? 0 : headCell.y + 1,
          },
          left: {
            x: headCell.x === 0 ? CANVAS_WIDTH - 1 : headCell.x - 1,
            y: headCell.y,
          },
          right: {
            x: headCell.x === CANVAS_WIDTH - 1 ? 0 : headCell.x + 1,
            y: headCell.y,
          },
        };
        let newHead = movement[
          direction as "up" | "down" | "left" | "right"
        ] as Cell;

        const isDead = possibleDirections.length === 0;

        let isGrowing = false;
        if (!isDead) {
          const beforeFood = newFood.length;
          newFood = newFood.filter((f: any) => {
            return !(f.x === newHead.x && f.y === newHead.y);
          });

          if (beforeFood !== newFood.length) {
            isGrowing = true;
          }

          const body = isGrowing ? current.cells : current.cells.slice(0, -1);

          newCells = [newHead, ...body];
        }
        newSnakes[i] = {
          ...current,
          isAlive: !isDead,
          direction,
          cells: isDead ? current.cells : newCells,
          tickCount: 0,
        };
      }
    }

    const deadSnakes = newSnakes.filter(
      (snake: any) => snake.isAlive === false
    );
    deadSnakes.forEach((snake: any) => {
      newFood = newFood.concat(snake.cells);
    });

    const newFoodSpawnTickCount = state.foodSpawnTickCount + 1;
    if (
      state.food.length < state.snakes.length * 2 &&
      newFoodSpawnTickCount === TICK_FOOD_SPAWN_COUNT &&
      state.snakes.length > 0
    ) {
      newFood.push({
        x: Math.floor(Math.random() * CANVAS_WIDTH),
        y: Math.floor(Math.random() * CANVAS_HEIGHT),
      });
    }
    return {
      ...state,
      foodSpawnTickCount:
        newFoodSpawnTickCount === TICK_FOOD_SPAWN_COUNT
          ? 0
          : newFoodSpawnTickCount,
      food: newFood,
      snakes: newSnakes.filter((snake: any) => snake.isAlive),
    };
  }
  return state;
};

const SnakeGameProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [visible, setVisible] = useState(true);

  useMessage((event: any) => {
    dispatch({
      type: "MESSAGE",
      payload: {
        commandData: event,
      },
    });
    if (event.message.message === "!snake") {
      setVisible(true);
    }

    if (event.message.message === "!snake toggle") {
      setVisible((currentVisible) => !currentVisible);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, TICK_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <SnakeGameContext.Provider
      value={{
        cellSize: CELL_SIZE,
        state,
        visible,
      }}
    >
      {children}
    </SnakeGameContext.Provider>
  );
};

export default SnakeGameProvider;
