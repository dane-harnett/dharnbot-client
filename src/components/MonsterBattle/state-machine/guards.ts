import { Context, Event } from "../types";

export const channelDead = ({ channel }: Context) => {
  if (channel === null) {
    return false;
  }
  return channel.health - 1 <= 0;
};
export const monsterDead = ({ currentMonster, currentAttackers }: Context) => {
  if (currentMonster === null || currentAttackers === null) {
    return false;
  }
  return currentMonster.health - currentAttackers.length <= 0;
};
export const triggerEncounter = (_ctx: Context, evt: Event) => {
  const isEmoteInMessage =
    evt.type === "MESSAGE" && evt.payload.message.context.emotes !== null;
  const isRandomInRange = Math.random() <= 1;
  return isEmoteInMessage && isRandomInRange;
};
export const startingTimerLessThan5 = ({ startingTimer }: Context) =>
  startingTimer < 5;
