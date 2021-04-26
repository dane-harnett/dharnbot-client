import { assign } from "xstate";
import { Context, Event, Monster, MonsterType } from "../types";

const baseChannel = {
  health: 30,
  maxHealth: 30,
};
const monsters: Record<string, Monster> = {
  dan_hornet: {
    type: MonsterType.Custom,
    id: "dan_hornet",
    name: "Dan Hornet",
    health: 45,
    maxHealth: 45,
    description: "Watch out you might get stung!",
    credits: "Artwork courtesy of RetroMMO and fruloo",
  },
};

export const tick = assign<Context, Event>(
  ({
    channel,
    currentMonster,
    currentAttackers,
    currentDefenders,
    currentHealers,
  }) => {
    const attackers = currentAttackers === null ? [] : currentAttackers;
    const defenders = currentDefenders === null ? [] : currentDefenders;
    const healers = currentHealers === null ? [] : currentHealers;
    let newChannel;
    if (channel === null) {
      newChannel = null;
    } else {
      const monsterStrength = 1;
      const possibleDamage = monsterStrength - defenders.length;
      const channelDamage = possibleDamage <= 0 ? 0 : possibleDamage;
      const newChannelHealth = channel.health - channelDamage + healers.length;
      newChannel = {
        ...channel,
        health: newChannelHealth,
      };
    }
    return {
      channel: newChannel,
      currentMonster:
        currentMonster === null || currentAttackers === null
          ? currentMonster
          : {
              ...currentMonster,
              health: currentMonster.health - attackers.length,
            },
    };
  }
);

export const addAttacker = assign<Context, Event>(
  ({ currentAttackers, currentDefenders, currentHealers }, evt) => {
    if (
      currentAttackers === null ||
      currentDefenders === null ||
      currentHealers === null
    ) {
      return { currentAttackers: null };
    }
    if (evt.type === "CHAT_ATTACK") {
      const existingAttacker = currentAttackers.find((user) => {
        return user.login === evt.payload.user.login;
      });
      const existingDefender = currentDefenders.find((user) => {
        return user.login === evt.payload.user.login;
      });
      const existingHealer = currentHealers.find((user) => {
        return user.login === evt.payload.user.login;
      });
      if (existingAttacker || existingDefender || existingHealer) {
        return { currentAttackers };
      }
      return { currentAttackers: currentAttackers.concat([evt.payload.user]) };
    }
    return { currentAttackers };
  }
);

export const addDefender = assign<Context, Event>(
  ({ currentAttackers, currentDefenders, currentHealers }, evt) => {
    if (
      currentDefenders === null ||
      currentAttackers === null ||
      currentHealers === null
    ) {
      return { currentDefenders: null };
    }
    if (evt.type === "CHAT_DEFEND") {
      const existingAttacker = currentAttackers.find((user) => {
        return user.login === evt.payload.user.login;
      });
      const existingDefender = currentDefenders.find((user) => {
        return user.login === evt.payload.user.login;
      });
      const existingHealer = currentHealers.find((user) => {
        return user.login === evt.payload.user.login;
      });
      if (existingDefender || existingAttacker || existingHealer) {
        return { currentDefenders };
      }
      return { currentDefenders: currentDefenders.concat([evt.payload.user]) };
    }
    return { currentDefenders };
  }
);

export const addHealer = assign<Context, Event>(
  ({ currentAttackers, currentDefenders, currentHealers }, evt) => {
    if (
      currentDefenders === null ||
      currentAttackers === null ||
      currentHealers === null
    ) {
      return { currentHealers: null };
    }
    if (evt.type === "CHAT_HEAL") {
      const existingAttacker = currentAttackers.find((user) => {
        return user.login === evt.payload.user.login;
      });
      const existingDefender = currentDefenders.find((user) => {
        return user.login === evt.payload.user.login;
      });
      const existingHealer = currentHealers.find((user) => {
        return user.login === evt.payload.user.login;
      });
      if (existingDefender || existingAttacker || existingHealer) {
        return { currentHealers };
      }
      return { currentHealers: currentHealers.concat([evt.payload.user]) };
    }
    return { currentHealers };
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
    return {
      currentAttackers: [],
      currentDefenders: [],
      currentHealers: [],
      currentMonster: {
        type: MonsterType.Emote,
        id: emoteId,
        name: emoteName,
        health: 45,
        maxHealth: 45,
        description: "",
        credits: "",
      },
      channel: {
        ...baseChannel,
      },
      startingTimer: 0,
    } as Context;
  }
  return {
    currentAttackers: [],
    currentDefenders: [],
    currentHealers: [],
    currentMonster: {
      ...monsters.dan_hornet,
    },
    channel: {
      ...baseChannel,
    },
    startingTimer: 0,
  } as Context;
});

export const incrementStartingTimer = assign<Context, Event>((ctx) => {
  return {
    startingTimer: ctx.startingTimer + 1,
  };
});
