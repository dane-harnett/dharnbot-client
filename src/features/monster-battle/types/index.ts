import monsterLevels from "../data/monsterLevels";

export enum MonsterType {
  Emote,
  Custom,
}

export interface Monster {
  type: MonsterType;
  credits: string;
  description: string;
  health: number;
  id: string;
  level: keyof typeof monsterLevels;
  maxHealth: number;
  name: string;
}

export interface Channel {
  health: number;
  maxHealth: number;
}

export interface User {
  login: string;
  profile_image_url: string;
}

export enum ParticipantType {
  Attacker,
  Blocker,
  Healer,
}

export interface Participant {
  login: string;
  profile_image_url: string;
  type: ParticipantType;
}
