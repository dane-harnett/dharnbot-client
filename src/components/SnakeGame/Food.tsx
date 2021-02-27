import React, { useContext } from "react";

import SnakeGameContext from "./SnakeGameContext";

interface Props {
  food: {
    x: number;
    y: number;
  };
}
const Food = ({ food }: Props) => {
  const { cellSize, visible } = useContext(SnakeGameContext);
  return (
    <div
      style={{
        left: food.x * cellSize,
        top: food.y * cellSize,
        position: "fixed",
        backgroundColor: "palevioletred",
        border: "1px solid #eeeeee",
        boxSizing: "border-box",
        opacity: visible ? 1 : 0,
        width: cellSize,
        height: cellSize,
        zIndex: 12,
      }}
    />
  );
};

export default Food;
