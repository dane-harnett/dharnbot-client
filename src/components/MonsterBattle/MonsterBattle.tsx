import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { useMessage } from "../../messages/useMessage";
import BattleStarting from "./BattleStarting";
import HealthBar from "./HealthBar";
import EncounterInstructions from "./EncounterInstructions";
import monsterBattleMachine from "./state-machine/machine";
import MonsterImage from "./MonsterImage";
import MonsterInfo from "./MonsterInfo";
import MonsterName from "./MonsterName";

const GameContainer = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 100px);
  z-index: 99;
`;

const MonsterBattle = () => {
  const [current, send] = useMachine(monsterBattleMachine);

  useMessage((event: any) => {
    const msg = event.message.message.toLowerCase();

    const isBroadcaster = event.message.context.badges?.broadcaster === "1";

    if (msg.indexOf("!attack") === 0 || msg.indexOf("!e1") === 0) {
      send({
        type: "CHAT_ATTACK",
        payload: {
          user: event.user,
        },
      });
    } else if (msg.indexOf("!defend") === 0) {
      send({
        type: "CHAT_DEFEND",
        payload: {
          user: event.user,
        },
      });
    } else if (msg.indexOf("!heal") === 0) {
      send({
        type: "CHAT_HEAL",
        payload: {
          user: event.user,
        },
      });
    } else if (["!monsterplz"].includes(msg) && isBroadcaster) {
      send("MANUAL_SPAWN");
    } else if (["!monstergo"].includes(msg) && isBroadcaster) {
      send("MANUAL_MONSTER_DEATH");
    } else if (event.message.message[0] !== "!") {
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
                          {current.context.currentMonster.name}
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
                {current.context.currentAttackers.map((u) => (
                  <img
                    src={u.profile_image_url}
                    style={{ width: 48, height: 48 }}
                  />
                ))}
                Defenders:
                {current.context.currentDefenders.map((u) => (
                  <img
                    src={u.profile_image_url}
                    style={{ width: 48, height: 48 }}
                  />
                ))}
                Healers:
                {current.context.currentHealers.map((u) => (
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
