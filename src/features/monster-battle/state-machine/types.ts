import { Channel, Monster, Participant, User } from "../types";

export interface Context {
  channel: Channel | null;
  currentMonster: Monster | null;
  participants: Participant[] | null;
  startingTimer: number;
}

export interface MessageEvent {
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
export interface ChatAttackEvent {
  type: "CHAT_ATTACK";
  payload: {
    user: User;
  };
}
export interface ChatDefendEvent {
  type: "CHAT_DEFEND";
  payload: {
    user: User;
  };
}
export interface ChatHealEvent {
  type: "CHAT_HEAL";
  payload: {
    user: User;
  };
}
export interface ManualSpawnEvent {
  type: "MANUAL_SPAWN";
}
export interface ManualMonsterDeathEvent {
  type: "MANUAL_MONSTER_DEATH";
}
export interface TickEvent {
  type: "TICK";
}

export type Event =
  | MessageEvent
  | ChatAttackEvent
  | ChatDefendEvent
  | ChatHealEvent
  | ManualSpawnEvent
  | ManualMonsterDeathEvent
  | TickEvent;

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
