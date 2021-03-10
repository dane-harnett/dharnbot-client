import * as React from "react";

interface MonsterImageProps {
  id: string;
}

const MonsterImage = ({ id }: MonsterImageProps): JSX.Element => {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        marginTop: 4,
      }}
    >
      <img src={`/assets/monster-battle/${id}.png`} alt="" />
    </div>
  );
};

export default MonsterImage;
