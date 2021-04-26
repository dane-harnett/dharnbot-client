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

export interface Context {
  channel: Channel | null;
  currentMonster: Monster | null;
  currentAttackers: User[] | null;
  startingTimer: number;
}

export type Event =
  | {
      type: "MESSAGE";
      payload: {
        message: {
          context: {
            emotes: Record<string, string[]>;
          };
          message: string;
        };
      };
    }
  | {
      type: "CHAT_ATTACK";
      payload: {
        user: User;
      };
    }
  | { type: "MANUAL_SPAWN" }
  | { type: "MANUAL_MONSTER_DEATH" }
  | { type: "TICK" };

export type IdleContext = Context & {
  channel: null;
  currentMonster: null;
  currentAttackers: null;
};

export type ActiveContext = Context & {
  channel: Channel;
  currentMonster: Monster;
  currentAttackers: User[];
};

export type State =
  | {
      value: "idle";
      context: IdleContext;
    }
  | {
      value: "starting";
      context: ActiveContext;
    }
  | {
      value: "active";
      context: ActiveContext;
    }
  | {
      value: "success";
      context: ActiveContext;
    }
  | {
      value: "fail";
      context: ActiveContext;
    };
