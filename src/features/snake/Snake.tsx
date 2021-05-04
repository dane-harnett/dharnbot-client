import React, { useContext } from "react";

import SnakeGameContext from "./SnakeGameContext";

const backgroundColor = "mediumseagreen";

interface Props {
  snake: any;
}
const Snake = ({ snake }: Props) => {
  const { cellSize, visible } = useContext(SnakeGameContext);

  return (
    <>
      {snake.cells.map((cell: any, index: number) => (
        <div
          style={{
            left: cell.x * cellSize,
            top: cell.y * cellSize,
            position: "fixed",
            backgroundColor: snake.user.color || backgroundColor,
            border: "1px solid #eeeeee",
            boxSizing: "border-box",
            opacity: visible ? 1 : 0,
            width: cellSize,
            height: cellSize,
            zIndex: index === 0 ? 11 : 10,
            backgroundImage:
              index === 0 ? `url(${snake.user.profile_image_url})` : "",
            backgroundSize: index === 0 ? "cover" : "",
          }}
        />
      ))}
    </>
  );
};
export default Snake;
