import React, { useContext } from "react";
import { Icon } from "@iconify/react";

import SnakeGameContext from "./SnakeGameContext";
import {
  Food as FoodInterface,
  TICKS_TIL_FOOD_SPOILS,
} from "./SnakeGameProvider";

interface Props {
  food: FoodInterface;
}
const Food = ({ food }: Props) => {
  const { cellSize, visible } = useContext(SnakeGameContext);
  let isHighlighted = false;
  const ticksTilSpoil = TICKS_TIL_FOOD_SPOILS - food.ticksSinceSpawn;
  if (ticksTilSpoil < 100) {
    isHighlighted = ticksTilSpoil % 8 < 4;
  }
  return (
    <div
      style={{
        left: food.x * cellSize,
        top: food.y * cellSize,
        position: "fixed",
        boxSizing: "border-box",
        opacity: visible ? 1 : 0,
        width: cellSize,
        height: cellSize,
        zIndex: 12,
        backgroundColor: isHighlighted ? "palevioletred" : "transparent",
      }}
    >
      <Icon icon={`twemoji:${food.kind}`} width={cellSize} height={cellSize} />
    </div>
  );
};

export default Food;
