import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";

import { useMessage } from "../../messages/useMessage";
import HealthBar from "./HealthBar";
import EncounterInstructions from "./EncounterInstructions";
import monsterBattleMachine from "./MonsterBattle.machine";
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
    } else if (["!monsterplz"].includes(msg) && isBroadcaster) {
      send("MANUAL_SPAWN");
    } else if (["!monstergo"].includes(msg) && isBroadcaster) {
      send("MANUAL_MONSTER_DEATH");
    } else if (event.message.message[0] !== "!") {
      send("MESSAGE");
    }
  }, []);

  if (
    current.matches("active") ||
    current.matches("success") ||
    current.matches("fail")
  ) {
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
                    <MonsterName>
                      {current.context.currentMonster.name}
                    </MonsterName>
                    <HealthBar
                      health={current.context.currentMonster.health}
                      maxHealth={current.context.currentMonster.maxHealth}
                    />
                    {current.matches("success") ? (
                      <img src="/assets/monster-battle/tenor.gif" alt="" />
                    ) : (
                      <MonsterImage id={current.context.currentMonster.id} />
                    )}
                    <MonsterInfo monster={current.context.currentMonster} />
                  </div>
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
                Channel HP: (
                {current.context.currentAttackers.map((u) => (
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
