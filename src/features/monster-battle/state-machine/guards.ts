import { isAttacker } from "../participants";
import emotes from "./emotes";
import { Context, Event } from "./types";

export const channelDead = ({ channel }: Context) => {
  if (channel === null) {
    return false;
  }
  return channel.health - 1 <= 0;
};

export const monsterDead = ({ currentMonster, participants }: Context) => {
  if (currentMonster === null) {
    return false;
  }
  const attackers =
    participants === null ? [] : participants.filter(isAttacker);
  return currentMonster.health - attackers.length <= 0;
};

export const triggerEncounter = (_ctx: Context, evt: Event) => {
  if (evt.type !== "MESSAGE") {
    return false;
  }

  const isEmoteInMessage =
    evt.type === "MESSAGE" && evt.payload.message.context.emotes !== null;

  if (!isEmoteInMessage) {
    return false;
  }

  const emoteId = Object.keys(evt.payload.message.context.emotes)[0];
  const emote = emotes.emotes.find(({ id }) => id === emoteId);
  const DEFAULT_ENCOUNTER_RATE = 0.15;
  const emoteEncounterRate = emote
    ? emote.encounterRate
    : DEFAULT_ENCOUNTER_RATE;

  const rando = Math.random();
  const willEncounter = rando <= emoteEncounterRate;

  return willEncounter;
};

export const startingTimerLessThan5 = ({ startingTimer }: Context) =>
  startingTimer < 5;
