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
  ({ channel, currentMonster, currentAttackers }) => ({
    channel:
      channel === null
        ? channel
        : {
            ...channel,
            health: channel.health - 1,
          },
    currentMonster:
      currentMonster === null || currentAttackers === null
        ? currentMonster
        : {
            ...currentMonster,
            health: currentMonster.health - currentAttackers.length,
          },
  })
);

export const addAttacker = assign<Context, Event>(
  ({ currentAttackers }, evt) => {
    if (currentAttackers === null) {
      return { currentAttackers: null };
    }
    if (evt.type === "CHAT_ATTACK") {
      const existingAttacker = currentAttackers.find((user) => {
        return user.login === evt.payload.user.login;
      });
      if (existingAttacker) {
        return { currentAttackers };
      }
      return { currentAttackers: currentAttackers.concat([evt.payload.user]) };
    }
    return { currentAttackers };
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
