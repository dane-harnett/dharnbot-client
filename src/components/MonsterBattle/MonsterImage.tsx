import * as React from "react";
import { MonsterType } from "./MonsterBattle.machine";

interface MonsterImageProps {
  id: string;
  type: MonsterType;
}

const MonsterImage = ({ id, type }: MonsterImageProps): JSX.Element => {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        marginTop: 4,
      }}
    >
      {type === MonsterType.Emote ? (
        <img
          src={`https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`}
          alt=""
        />
      ) : (
        <img src={`/assets/monster-battle/${id}.png`} alt="" />
      )}
    </div>
  );
};

export default MonsterImage;
