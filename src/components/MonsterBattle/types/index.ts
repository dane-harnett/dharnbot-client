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
  level: number;
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
  Defender,
  Healer,
}

export interface Participant {
  login: string;
  profile_image_url: string;
  type: ParticipantType;
}

export interface Context {
  channel: Channel | null;
  currentMonster: Monster | null;
  participants: Participant[] | null;
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
  | {
      type: "CHAT_DEFEND";
      payload: {
        user: User;
      };
    }
  | {
      type: "CHAT_HEAL";
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
  participants: null;
};

export type ActiveContext = Context & {
  channel: Channel;
  currentMonster: Monster;
  participants: Participant[];
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
