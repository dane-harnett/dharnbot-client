import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { useMessage } from "../../../messages/useMessage";
import BattleStarting from "./BattleStarting";
import HealthBar from "./HealthBar";
import EncounterInstructions from "./EncounterInstructions";
import monsterBattleMachine from "../state-machine/machine";
import MonsterImage from "./MonsterImage";
import MonsterInfo from "./MonsterInfo";
import MonsterName from "./MonsterName";
import { isAttacker, isBlocker, isHealer } from "../participants";
import {
  ChatAttackEvent,
  ChatBlockEvent,
  ChatHealEvent,
  ManualSpawnEvent,
  ManualMonsterDeathEvent,
} from "../state-machine/types";

const GameContainer = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 100px);
  z-index: 99;
`;

const actionList = [
  {
    messagePrefixes: ["!attack", "!e1"],
    isBroadcasterOnly: false,
    action: (event: any) => {
      return {
        type: "CHAT_ATTACK",
        payload: {
          user: event.user,
        },
      } as ChatAttackEvent;
    },
  },
  {
    messagePrefixes: ["!defend", "!d1"],
    isBroadcasterOnly: false,
    action: (event: any) => {
      return {
        type: "CHAT_BLOCK",
        payload: {
          user: event.user,
        },
      } as ChatBlockEvent;
    },
  },
  {
    messagePrefixes: ["!heal", "!h1"],
    isBroadcasterOnly: false,
    action: (event: any) => {
      return {
        type: "CHAT_HEAL",
        payload: {
          user: event.user,
        },
      } as ChatHealEvent;
    },
  },
  {
    messagePrefixes: ["!monsterplz"],
    isBroadcasterOnly: true,
    action: () => {
      return {
        type: "MANUAL_SPAWN",
      } as ManualSpawnEvent;
    },
  },
  {
    messagePrefixes: ["!monstergo"],
    isBroadcasterOnly: true,
    action: () => {
      return {
        type: "MANUAL_MONSTER_DEATH",
      } as ManualMonsterDeathEvent;
    },
  },
];

const MonsterBattle = () => {
  const [current, send] = useMachine(monsterBattleMachine);

  useMessage((event: any) => {
    const msg = event.message.message.toLowerCase();

    const isBroadcaster = event.message.context.badges?.broadcaster === "1";

    const currentActionItem = actionList.find((actionItem) => {
      if (
        actionItem.messagePrefixes.some((prefix) => msg.indexOf(prefix) === 0)
      ) {
        return true;
      }
      return false;
    });
    if (
      currentActionItem &&
      (!currentActionItem.isBroadcasterOnly ||
        (currentActionItem.isBroadcasterOnly && isBroadcaster))
    ) {
      send(currentActionItem.action(event));
      return;
    }
    if (event.message.message[0] !== "!") {
      send({
        type: "MESSAGE",
        payload: { ...event },
      });
    }
  }, []);

  if (
    current.matches("starting") ||
    current.matches("active") ||
    current.matches("success") ||
    current.matches("fail")
  ) {
    const health = current.context.currentMonster.health;
    const maxHealth = current.context.currentMonster.maxHealth;
    const normalizedHealth = health < 0 ? 0 : health;
    const healthPercent = Math.floor((normalizedHealth / maxHealth) * 100);
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
            {current.matches("fail") ? (
              <div>
                <img
                  style={{ width: "100%", height: "100%" }}
                  src="/assets/monster-battle/game-over.gif"
                  alt=""
                />
              </div>
            ) : (
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
                    backgroundColor: "transparent",
                    borderRadius: "50%",
                    width: 900,
                    height: 900,
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgressbarWithChildren
                    background
                    strokeWidth={4}
                    styles={{
                      background: { fill: "#000000" },
                      path: {
                        stroke: "mediumseagreen",
                      },
                      root: {
                        width: 500,
                      },
                    }}
                    value={healthPercent}
                  >
                    {current.matches("starting") ? (
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
                        <BattleStarting>
                          Battle starting in {5 - current.context.startingTimer}
                        </BattleStarting>
                      </div>
                    ) : (
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
                        <MonsterName>
                          {current.context.currentMonster.name} LVL
                          {current.context.currentMonster.level}
                        </MonsterName>
                        {current.matches("success") ? (
                          <img src="/assets/monster-battle/tenor.gif" alt="" />
                        ) : (
                          <MonsterImage
                            id={current.context.currentMonster.id}
                            type={current.context.currentMonster.type}
                          />
                        )}
                        <MonsterInfo monster={current.context.currentMonster} />
                      </div>
                    )}
                  </CircularProgressbarWithChildren>
                </div>
              </div>
            )}
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
                Channel HP: (Attackers:
                {current.context.participants.filter(isAttacker).map((u) => (
                  <img
                    src={u.profile_image_url}
                    style={{ width: 48, height: 48 }}
                  />
                ))}
                Defenders:
                {current.context.participants.filter(isBlocker).map((u) => (
                  <img
                    src={u.profile_image_url}
                    style={{ width: 48, height: 48 }}
                  />
                ))}
                Healers:
                {current.context.participants.filter(isHealer).map((u) => (
                  <img
                    src={u.profile_image_url}
                    style={{ width: 48, height: 48 }}
                  />
                ))}
                )
              </div>
              <HealthBar
                health={current.context.channel.health}
                maxHealth={current.context.channel.maxHealth}
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
  }

  return null;
};

export default MonsterBattle;
