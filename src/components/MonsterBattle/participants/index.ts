import { Participant, ParticipantType } from "../types";

export const isAttacker = ({ type }: Participant) =>
  type === ParticipantType.Attacker;
export const isDefender = ({ type }: Participant) =>
  type === ParticipantType.Defender;
export const isHealer = ({ type }: Participant) =>
  type === ParticipantType.Healer;
