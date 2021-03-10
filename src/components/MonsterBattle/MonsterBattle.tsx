import React, { useReducer } from "react";

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

interface EncounterAction {
  type: "ENCOUNTER";
}

interface AttackAction {
  type: "ATTACK";
}

type Action = EncounterAction | AttackAction;

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ENCOUNTER":
      if (state.currentMonster !== null) {
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
      if (state.currentMonster.health - 1 === 0) {
        return {
          ...state,
          currentMonster: null,
        };
      }
      return {
        ...state,
        currentMonster: {
          ...state.currentMonster,
          health: state.currentMonster.health - 1,
        },
      };
    default:
      return state;
  }
};

const MonsterBattle = () => {
  const [state, dispatch] = useReducer(reducer, { currentMonster: null });

  useMessage((event: any) => {
    if (["!encounter", "!enc"].includes(event.message.message.toLowerCase())) {
      dispatch({ type: "ENCOUNTER" });
    }

    if (["!attack", "!e1"].includes(event.message.message.toLowerCase())) {
      dispatch({ type: "ATTACK" });
    }
  }, []);

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
            <MonsterName monster={state.currentMonster} />
            <HealthBar
              health={state.currentMonster.health}
              maxHealth={state.currentMonster.maxHealth}
            />
            <MonsterImage id={state.currentMonster.id} />
            <MonsterInfo monster={state.currentMonster} />
          </div>
        </div>
      </div>
      <EncounterInstructions />
    </div>
  );
};

export default MonsterBattle;
