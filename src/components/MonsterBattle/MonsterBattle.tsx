import React, { useEffect, useReducer } from "react";

import { useMessage } from "../../messages/useMessage";
import HealthBar from "./HealthBar";
import EncounterInstructions from "./EncounterInstructions";
import MonsterImage from "./MonsterImage";
import MonsterInfo from "./MonsterInfo";
import MonsterName from "./MonsterName";

const monsters = {
  dan_hornet: {
    id: "dan_hornet",
    name: "Dan Hornet",
    health: 5,
    maxHealth: 5,
    description: "Watch out you might get stung!",
    credits: "Artwork courtesy of RetroMMO and fruloo",
  },
};

export interface Monster {
  credits: string;
  description: string;
  health: number;
  id: string;
  maxHealth: number;
  name: string;
}

interface State {
  currentMonster: Monster | null;
}

interface MessageAction {
  type: "MESSAGE";
}
interface AttackAction {
  type: "ATTACK";
}
interface MonsterKilledAction {
  type: "MONSTER_KILLED";
}
interface ManualSpawnAction {
  type: "MANUAL_SPAWN";
}

type Action =
  | MessageAction
  | AttackAction
  | MonsterKilledAction
  | ManualSpawnAction;

const MESSAGE_ENCOUNTER_RATE = 0.09;

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "MESSAGE":
      if (state.currentMonster !== null) {
        return state;
      }

      const triggerEncounter = Math.random() <= MESSAGE_ENCOUNTER_RATE;

      if (!triggerEncounter) {
        return state;
      }

      return {
        ...state,
        currentMonster: { ...monsters.dan_hornet },
      };
    case "ATTACK":
      if (state.currentMonster === null) {
        return state;
      }
      if (state.currentMonster.health - 1 < 0) {
        return state;
      }
      return {
        ...state,
        currentMonster: {
          ...state.currentMonster,
          health: state.currentMonster.health - 1,
        },
      };
    case "MONSTER_KILLED":
      return {
        ...state,
        currentMonster: null,
      };
    case "MANUAL_SPAWN":
      if (state.currentMonster !== null) {
        return state;
      }

      return {
        ...state,
        currentMonster: { ...monsters.dan_hornet },
      };
    default:
      return state;
  }
};

const MonsterBattle = () => {
  const [state, dispatch] = useReducer(reducer, { currentMonster: null });

  useMessage((event: any) => {
    const msg = event.message.message.toLowerCase();

    const isBroadcaster = event.message.context.badges?.broadcaster === "1";

    if (["!attack", "!e1"].includes(msg)) {
      dispatch({ type: "ATTACK" });
    } else if (["!monsterplz"].includes(msg) && isBroadcaster) {
      dispatch({ type: "MANUAL_SPAWN" });
    } else if (event.message.message[0] !== "!") {
      dispatch({ type: "MESSAGE" });
    }
  }, []);

  useEffect(() => {
    if (state.currentMonster && state.currentMonster.health === 0) {
      setTimeout(() => {
        dispatch({ type: "MONSTER_KILLED" });
      }, 1000);
    }
  }, [state.currentMonster]);

  if (state.currentMonster === null) {
    return null;
  }

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
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <div
          style={{
            backgroundColor: "black",
            borderRadius: "50%",
            width: 500,
            height: 500,
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              alignItems: "stretch",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: 300,
              height: 300,
            }}
          >
            <MonsterName>{state.currentMonster.name}</MonsterName>
            <HealthBar
              health={state.currentMonster.health}
              maxHealth={state.currentMonster.maxHealth}
            />
            {state.currentMonster.health <= 0 ? (
              <img src={"/assets/monster-battle/tenor.gif"} />
            ) : (
              <MonsterImage id={state.currentMonster.id} />
            )}
            <MonsterInfo monster={state.currentMonster} />
          </div>
        </div>
      </div>
      <EncounterInstructions />
    </div>
  );
};

export default MonsterBattle;
