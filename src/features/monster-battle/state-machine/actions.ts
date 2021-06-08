import { assign } from "xstate";
import channelData from "../data/channel";
import customMonsters from "../data/customMonsters";
import monsterLevels from "../data/monsterLevels";
import { isAttacker, isBlocker, isHealer } from "../participants";
import { MonsterType, ParticipantType } from "../types";
import { Context, Event } from "./types";

export const tick = assign<Context, Event>(
  ({ channel, currentMonster, participants }) => {
    if (currentMonster === null) {
      return {
        channel,
        currentMonster,
      };
    }

    let attackers = [];
    let blockers = [];
    let healers = [];
    if (participants !== null) {
      attackers = participants.filter(isAttacker);
      blockers = participants.filter(isBlocker);
      healers = participants.filter(isHealer);
    }

    let newChannel;
    if (channel === null) {
      newChannel = null;
    } else {
      const monsterLevel = monsterLevels[currentMonster.level];
      const variedDamage =
        Math.floor(Math.random() * monsterLevel.damage.max) +
        monsterLevel.damage.min;
      const possibleDamage = variedDamage - blockers.length;
      const channelDamage = possibleDamage <= 0 ? 0 : possibleDamage;
      console.log("@@@ channelDamage this tick is", channelDamage);
      const newChannelHealth = channel.health - channelDamage + healers.length;
      newChannel = {
        ...channel,
        health:
          newChannelHealth > channel.maxHealth
            ? channel.maxHealth
            : newChannelHealth,
      };
    }

    const damageToMonster = attackers.length;

    return {
      channel: newChannel,
      currentMonster: {
        ...currentMonster,
        health: currentMonster.health - damageToMonster,
      },
    };
  }
);

export const addParticipant = assign<Context, Event>(
  ({ participants }, evt) => {
    if (participants === null) {
      return { participants: null };
    }
    if (
      evt.type === "CHAT_ATTACK" ||
      evt.type === "CHAT_BLOCK" ||
      evt.type === "CHAT_HEAL"
    ) {
      const existing = participants.find((user) => {
        return user.login === evt.payload.user.login;
      });
      if (existing) {
        return { participants };
      }
      return {
        participants: participants.concat([
          {
            ...evt.payload.user,
            type:
              evt.type === "CHAT_ATTACK"
                ? ParticipantType.Attacker
                : evt.type === "CHAT_BLOCK"
                ? ParticipantType.Blocker
                : ParticipantType.Healer,
          },
        ]),
      };
    }
    return { participants };
  }
);

export const startEncounter = assign<Context, Event>((_ctx, evt) => {
  if (evt.type === "MESSAGE") {
    const emoteId = Object.keys(evt.payload.message.context.emotes)[0];
    const emoteData = evt.payload.message.context.emotes[emoteId];
    const startIndex = parseInt(emoteData[0].split("-")[0], 10);
    const endIndex = parseInt(emoteData[0].split("-")[1], 10);
    const emoteName = evt.payload.message.message.substring(
      startIndex,
      endIndex + 1
    );

    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const monsterLevel = randomNumber as keyof typeof monsterLevels;

    return {
      currentMonster: {
        type: MonsterType.Emote,
        id: emoteId,
        level: monsterLevel,
        name: emoteName,
        health: monsterLevels[monsterLevel].maxHealth,
        maxHealth: monsterLevels[monsterLevel].maxHealth,
        description: "",
        credits: "",
      },
      channel: {
        ...channelData,
      },
      participants: [],
      startingTimer: 0,
    } as Context;
  }

  return {
    currentMonster: {
      ...customMonsters.dan_hornet,
    },
    channel: {
      ...channelData,
    },
    participants: [],
    startingTimer: 0,
  } as Context;
});

export const incrementStartingTimer = assign<Context, Event>((ctx) => {
  return {
    startingTimer: ctx.startingTimer + 1,
  };
});
