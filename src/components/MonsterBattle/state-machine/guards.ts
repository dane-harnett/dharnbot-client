import { isAttacker } from "../participants";
import { Context, Event, ParticipantType } from "../types";

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
  const isEmoteInMessage =
    evt.type === "MESSAGE" && evt.payload.message.context.emotes !== null;
  const isRandomInRange = Math.random() <= 0.8;
  return isEmoteInMessage && isRandomInRange;
};

export const startingTimerLessThan5 = ({ startingTimer }: Context) =>
  startingTimer < 5;
