import * as React from "react";
import type { Monster } from "./MonsterBattle.machine";

interface MonsterInfoProps {
  monster: Monster;
}

const MonsterInfo = ({ monster }: MonsterInfoProps): JSX.Element => {
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        fontSize: "14px",
        marginTop: 4,
        padding: 4,
      }}
    >
      {monster.description}
      <br />
      {monster.credits}
    </div>
  );
};

export default MonsterInfo;
