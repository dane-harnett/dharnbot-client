import React, { useEffect, useReducer, useRef } from "react";
import styled from "styled-components";

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

interface Channel {
  health: number;
  maxHealth: number;
}

interface State {
  channel: Channel | null;
  currentMonster: Monster | null;
  encounterStatus: string;
}

interface MessageAction {
  type: "MESSAGE";
}
interface ChatAttackAction {
  type: "CHAT_ATTACK";
}
interface MonsterKilledAction {
  type: "MONSTER_KILLED";
}
interface ManualSpawnAction {
  type: "MANUAL_SPAWN";
}
interface ManualMonsterDeathAction {
  type: "MANUAL_MONSTER_DEATH";
}
interface ResetAction {
  type: "RESET";
}
interface MonsterAttackAction {
  type: "MONSTER_ATTACK";
}

type Action =
  | ChatAttackAction
  | ManualMonsterDeathAction
  | ManualSpawnAction
  | MessageAction
  | MonsterAttackAction
  | MonsterKilledAction
  | ResetAction;

const MESSAGE_ENCOUNTER_RATE = 0.09;

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "MESSAGE":
      if (state.encounterStatus !== "IDLE") {
        return state;
      }

      const triggerEncounter = Math.random() <= MESSAGE_ENCOUNTER_RATE;

      if (!triggerEncounter) {
        return state;
      }

      return {
        ...state,
        currentMonster: { ...monsters.dan_hornet },
        channel: { health: 10, maxHealth: 10 },
        encounterStatus: "ACTIVE",
      };
    case "CHAT_ATTACK":
      if (state.encounterStatus !== "ACTIVE") {
        return state;
      }
      if (state.currentMonster === null) {
        return state;
      }
      return {
        ...state,
        currentMonster: {
          ...state.currentMonster,
          health: state.currentMonster.health - 1,
        },
        encounterStatus:
          state.currentMonster.health - 1 === 0 ? "SUCCESS" : "ACTIVE",
      };
    case "MONSTER_ATTACK":
      if (state.encounterStatus !== "ACTIVE") {
        return state;
      }
      if (state.channel === null) {
        return state;
      }
      return {
        ...state,
        channel: {
          ...state.channel,
          health: state.channel.health - 1,
        },
        encounterStatus: state.channel.health - 1 === 0 ? "FAIL" : "ACTIVE",
      };
    case "MANUAL_SPAWN":
      if (state.encounterStatus !== "IDLE") {
        return state;
      }

      return {
        ...state,
        currentMonster: { ...monsters.dan_hornet },
        channel: { health: 10, maxHealth: 10 },
        encounterStatus: "ACTIVE",
      };
    case "MANUAL_MONSTER_DEATH":
      if (state.encounterStatus !== "ACTIVE") {
        return state;
      }

      return {
        ...state,
        currentMonster: {
          ...state.currentMonster,
          health: 0,
        },
        encounterStatus: "SUCCESS",
      };
    case "RESET":
      return {
        ...state,
        currentMonster: null,
        channel: null,
        encounterStatus: "IDLE",
      };
    default:
      return state;
  }
};

const GameContainer = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 100px);
  z-index: 99;
`;

const MonsterBattle = () => {
  const [state, dispatch] = useReducer(reducer, {
    channel: null,
    currentMonster: null,
    encounterStatus: "IDLE",
  });
  const monsterAttackRef = useRef<ReturnType<typeof setInterval>>(null!);

  useMessage((event: any) => {
    const msg = event.message.message.toLowerCase();

    const isBroadcaster = event.message.context.badges?.broadcaster === "1";

    if (msg.indexOf("!attack") === 0 || msg.indexOf("!e1") === 0) {
      dispatch({ type: "CHAT_ATTACK" });
    } else if (["!monsterplz"].includes(msg) && isBroadcaster) {
      dispatch({ type: "MANUAL_SPAWN" });
    } else if (["!monstergo"].includes(msg) && isBroadcaster) {
      dispatch({ type: "MANUAL_MONSTER_DEATH" });
    } else if (event.message.message[0] !== "!") {
      dispatch({ type: "MESSAGE" });
    }
  }, []);

  useEffect(() => {
    if (state.encounterStatus === "ACTIVE") {
      monsterAttackRef.current = setInterval(() => {
        dispatch({ type: "MONSTER_ATTACK" });
      }, 2000);
    }
    if (
      state.encounterStatus === "SUCCESS" ||
      state.encounterStatus === "FAIL"
    ) {
      clearInterval(monsterAttackRef.current);
      setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 1000);
    }
  }, [state.encounterStatus]);

  if (state.channel === null || state.currentMonster === null) {
    return null;
  }

  return (
    <GameContainer>
      <div
        style={{
          alignItems: "stretch",
          display: "flex",
          height: "100%",
          justifyContent: "stretch",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            width: 1520,
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              height: "100%",
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
                {state.encounterStatus === "SUCCESS" ? (
                  <img src={"/assets/monster-battle/tenor.gif"} />
                ) : (
                  <MonsterImage id={state.currentMonster.id} />
                )}
                <MonsterInfo monster={state.currentMonster} />
              </div>
            </div>
          </div>
          <div
            style={{
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 48,
                backgroundColor: "black",
                color: "white",
                display: "inline-block",
                padding: 4,
              }}
            >
              Channel HP
            </div>
            <HealthBar
              health={state.channel.health}
              maxHealth={state.channel.maxHealth}
            />
          </div>
        </div>
        <div
          style={{
            width: 400,
          }}
        >
          <EncounterInstructions />
        </div>
      </div>
    </GameContainer>
  );
};

export default MonsterBattle;
