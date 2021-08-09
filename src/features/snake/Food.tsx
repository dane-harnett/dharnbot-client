import React, { useContext, useState } from "react";
import * as Icons from "@material-ui/icons";
import SvgIcon from "@material-ui/core/SvgIcon";

import SnakeGameContext from "./SnakeGameContext";

const allIcons = Object.entries(Icons);

interface Props {
  food: {
    x: number;
    y: number;
  };
}
const Food = ({ food }: Props) => {
  const { cellSize, visible } = useContext(SnakeGameContext);
  const [Icon] = useState<typeof SvgIcon>(
    allIcons[Math.floor(Math.random() * allIcons.length)][1]
  );
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
      }}
    >
      <Icon fontSize="large" htmlColor="palevioletred" />
    </div>
  );
};

export default Food;
