import React, { useEffect, useReducer, useState } from "react";
import { useMessage } from "../../messages/useMessage";
import SnakeGameContext from "./SnakeGameContext";

type Direction = "up" | "down" | "left" | "right";

interface Cell {
  x: number;
  y: number;
}

interface Snake {
  cells: Cell[];
  direction: Direction;
  isAlive: boolean;
  speed: number;
  user: {
    login: string;
  };
  tickCount: number;
}
const foodKinds = [
  "avocado",
  "bacon",
  "bagel",
  "baguette-bread",
  "banana",
  "bell-pepper",
  "blueberries",
  "bread",
  "broccoli",
  "carrot",
  "grapes",
  "green-apple",
  "hot-pepper",
  "kiwi-fruit",
  "meat-on-bone",
] as const;
export type FoodKind = typeof foodKinds[number];
export interface Food {
  x: number;
  y: number;
  ticksSinceSpawn: number;
  kind: FoodKind;
}

interface State {
  foodSpawnTickCount: number;
  food: Food[];
  snakes: Snake[];
}
interface MessageAction {
  type: "MESSAGE";
  payload: any;
}
interface TickAction {
  type: "MESSAGE";
  payload: any;
}
type Action = MessageAction | TickAction;

const CELL_SIZE = 30;
const CANVAS_WIDTH = 1920 / CELL_SIZE;
const CANVAS_HEIGHT = 1080 / CELL_SIZE;
const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];
const TICK_DURATION = 50;
const TICK_FOOD_SPAWN_COUNT = 1000 / TICK_DURATION;
export const TICKS_TIL_FOOD_SPOILS = 200;

const getRandomItem = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

const initialState: State = {
  foodSpawnTickCount: 0,
  food: [],
  snakes: [],
};

const isDontReverseDirectionEnabled = true;
const dontReverseDirection = (current: Snake) => (d: Direction) => {
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
const isDontWrapAroundEnabled = true;
const dontWrapAround = (current: Snake) => (d: Direction) => {
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

const isCanSlitherOverSelfEnabled = false;
const dontRunIntoAnotherSnake = (current: Snake, snakes: Snake[]) => (
  d: Direction
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

  const isAnotherSnakeInDirection = !!snakes.find((snake: Snake) => {
    if (
      isCanSlitherOverSelfEnabled &&
      snake.user.login === current.user.login
    ) {
      return false;
    }
    return snake.cells.find((cell: Cell) => {
      return cell.x === newHead.x && cell.y === newHead.y;
    });
  });

  return !isAnotherSnakeInDirection;
};

type Reducer<S, A> = (state: S, action: A) => S;

const reducer = (state: State, action: Action) => {
  if (action.type === "MESSAGE") {
    if (
      (action.payload.commandData.message.context.badges?.broadcaster === "1" ||
        action.payload.commandData.message.context.mod) &&
      action.payload.commandData.message.message.indexOf("!snake remove") === 0
    ) {
      const usernameSnakeToRemove = action.payload.commandData.message.message.replace(
        "!snake remove ",
        ""
      );
      const newSnakes = state.snakes.filter((snake: Snake) => {
        return !(
          snake.user.login.toLowerCase() === usernameSnakeToRemove.toLowerCase()
        );
      });
      return {
        ...state,
        snakes: newSnakes,
      };
    }
    if (action.payload.commandData.message.message === "!snake fast") {
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

    if (action.payload.commandData.message.message === "!snake medium") {
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

    if (action.payload.commandData.message.message === "!snake slow") {
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

    if (action.payload.commandData.message.message === "!snake") {
      const userSnakes = state.snakes.filter(
        (snake: Snake) =>
          snake.user.login === action.payload.commandData.user.login
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
  } else if (action.type === "TICK") {
    let newFood = [
      ...state.food
        .map((food: Food) => ({
          ...food,
          ticksSinceSpawn: food.ticksSinceSpawn++,
        }))
        .filter((food: Food) => food.ticksSinceSpawn < TICKS_TIL_FOOD_SPOILS),
    ];
    let newSnakes = [...state.snakes];

    for (let i = 0; i < newSnakes.length; i++) {
      const current = newSnakes[i];

      if (newSnakes[i].speed > newSnakes[i].tickCount) {
        newSnakes[i].tickCount += 1;
      } else {
        const possibleDirections: Direction[] = [
          current.direction,
          current.direction,
          ...DIRECTIONS,
        ]
          .filter(dontReverseDirection(current))
          .filter(dontWrapAround(current))
          .filter(dontRunIntoAnotherSnake(current, newSnakes));

        // if there is food in the current.direction
        // and we can continue in that direction
        // then continue in that direction

        const isFoodInCurrentDirection = !!state.food.find((food: Food) => {
          const head = current.cells[0];
          if (current.direction === "up") {
            return food.x === head.x && food.y < head.y;
          }
          if (current.direction === "left") {
            return food.y === head.y && food.x < head.x;
          }
          if (current.direction === "down") {
            return food.x === head.x && food.y > head.y;
          }
          if (current.direction === "right") {
            return food.y === head.y && food.x > head.x;
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
        let newHead = movement[direction as Direction] as Cell;

        const isDead = possibleDirections.length === 0;

        let isGrowing = false;
        if (!isDead) {
          const beforeFood = newFood.length;
          newFood = newFood.filter((f: Food) => {
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
      (snake: Snake) => snake.isAlive === false
    );
    deadSnakes.forEach((snake: Snake) => {
      newFood = newFood.concat(
        snake.cells.map((cell: Cell) => ({
          ...cell,
          ticksSinceSpawn: 0,
          kind: foodKinds[Math.floor(Math.random() * foodKinds.length)],
        }))
      );
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
        ticksSinceSpawn: 0,
        kind: foodKinds[Math.floor(Math.random() * foodKinds.length)],
      });
    }
    return {
      ...state,
      foodSpawnTickCount:
        newFoodSpawnTickCount === TICK_FOOD_SPAWN_COUNT
          ? 0
          : newFoodSpawnTickCount,
      food: newFood,
      snakes: newSnakes.filter((snake: Snake) => snake.isAlive),
    };
  }
  return state;
};

const useLocalStorageReducer = (
  key: string,
  reducer: Reducer<State, Action>,
  initialState: State
) => {
  let persistedState = initialState;
  const localStorageState = window.localStorage.getItem(key);
  if (typeof localStorageState === "string") {
    try {
      persistedState = JSON.parse(localStorageState);
    } catch (err) {
      persistedState = initialState;
    }
  }
  const [state, dispatch] = useReducer(reducer, persistedState);

  window.localStorage.setItem(key, JSON.stringify(state));

  return [state, dispatch];
};

const SnakeGameProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useLocalStorageReducer(
    "SNAKE_STATE",
    reducer,
    initialState
  );
  const [visible, setVisible] = useState(true);

  useMessage((event: any) => {
    // @ts-ignore
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
      // @ts-ignore
      dispatch({ type: "TICK" });
    }, TICK_DURATION);
    return () => clearInterval(timer);
    // eslint-disable-next-line
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
