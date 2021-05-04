import React, { useContext } from "react";
import SnakeGameContext from "./SnakeGameContext";

const Leaderboard = () => {
  const { state } = useContext(SnakeGameContext);

  let longestSnake = state.snakes[0];
  state.snakes.forEach((snake: any) => {
    if (snake.cells.length > longestSnake.cells.length) {
      longestSnake = snake;
    }
  });
  return (
    <>
      {longestSnake && (
        <div
          style={{
            color: "#fff",
          }}
        >
          Longest snake: {longestSnake.user.login} ({longestSnake.cells.length})
        </div>
      )}
    </>
  );
};

export default Leaderboard;
