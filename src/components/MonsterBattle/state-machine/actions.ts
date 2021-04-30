import { assign } from "xstate";
import { isAttacker, isDefender, isHealer } from "../participants";
import {
  Context,
  Event,
  Monster,
  MonsterType,
  ParticipantType,
} from "../types";

const monsterLevels = {
  1: {
    maxHealth: 4,
  },
  2: {
    maxHealth: 8,
  },
  3: {
    maxHealth: 12,
  },
  4: {
    maxHealth: 16,
  },
  5: {
    maxHealth: 20,
  },
  6: {
    maxHealth: 24,
  },
  7: {
    maxHealth: 28,
  },
  8: {
    maxHealth: 32,
  },
  9: {
    maxHealth: 36,
  },
  10: {
    maxHealth: 40,
  },
};

const baseChannel = {
  health: 30,
  maxHealth: 30,
};

const DAN_HORNET_LEVEL = 10;
const monsters: Record<string, Monster> = {
  dan_hornet: {
    type: MonsterType.Custom,
    id: "dan_hornet",
    level: DAN_HORNET_LEVEL,
    name: "Dan Hornet",
    health: monsterLevels[DAN_HORNET_LEVEL].maxHealth,
    maxHealth: monsterLevels[DAN_HORNET_LEVEL].maxHealth,
    description: "Watch out you might get stung!",
    credits: "Artwork courtesy of RetroMMO and fruloo",
  },
};

export const tick = assign<Context, Event>(
  ({ channel, currentMonster, participants }) => {
    let attackers = [];
    let defenders = [];
    let healers = [];
    if (participants !== null) {
      attackers = participants.filter(isAttacker);
      defenders = participants.filter(isDefender);
      healers = participants.filter(isHealer);
    }

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
        health:
          newChannelHealth > channel.maxHealth
            ? channel.maxHealth
            : newChannelHealth,
      };
    }

    const damageToMonster = attackers.length;

    return {
      channel: newChannel,
      currentMonster:
        currentMonster === null
          ? currentMonster
          : {
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
      evt.type === "CHAT_DEFEND" ||
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
                : evt.type === "CHAT_DEFEND"
                ? ParticipantType.Defender
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
        ...baseChannel,
      },
      participants: [],
      startingTimer: 0,
    } as Context;
  }

  return {
    currentMonster: {
      ...monsters.dan_hornet,
    },
    channel: {
      ...baseChannel,
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