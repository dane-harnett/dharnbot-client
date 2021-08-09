import React, { useContext } from "react";
import Food from "./Food";
import Snake from "./Snake";
import SnakeGameContext from "./SnakeGameContext";

const SnakeGame = () => {
  const { state } = useContext(SnakeGameContext);

  return (
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
      {state.snakes.map((snake: any) => (
        <Snake snake={snake} />
      ))}
      {state.food.map((food: any) => (
        <Food food={food} key={`x:${food.x}y:${food.y}`} />
      ))}
    </div>
  );
};

export default SnakeGame;
