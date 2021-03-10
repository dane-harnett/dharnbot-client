import * as React from "react";
import { Monster } from "./MonsterBattle";

interface MonsterNameProps {
  monster: Monster;
}

const MonsterName = ({ monster }: MonsterNameProps): JSX.Element => {
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        fontSize: "20px",
        marginTop: 4,
        padding: 4,
        textTransform: "uppercase",
      }}
    >
      {monster.name}
    </div>
  );
};

export default MonsterName;
