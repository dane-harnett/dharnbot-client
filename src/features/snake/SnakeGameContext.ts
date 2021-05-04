import React from "react";

interface SnakeGameContextValue {
  state: any;
  visible: boolean;
  cellSize: number;
}
const SnakeGameContext = React.createContext<SnakeGameContextValue>({
  state: {},
  visible: true,
  cellSize: 30,
});

export default SnakeGameContext;
