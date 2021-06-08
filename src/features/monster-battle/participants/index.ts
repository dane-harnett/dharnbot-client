import { Participant, ParticipantType } from "../types";

export const isAttacker = ({ type }: Participant) =>
  type === ParticipantType.Attacker;
export const isBlocker = ({ type }: Participant) =>
  type === ParticipantType.Blocker;
export const isHealer = ({ type }: Participant) =>
  type === ParticipantType.Healer;
