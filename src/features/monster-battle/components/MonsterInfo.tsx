import * as React from "react";
import { Monster } from "../types";

interface MonsterInfoProps {
  monster: Monster;
}

const MonsterInfo = ({ monster }: MonsterInfoProps): JSX.Element => {
  if (monster.description === "" && monster.credits === "") {
    return <></>;
  }
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
