import { createMachine } from "xstate";

import * as actions from "./actions";

export type Context = {
  words: Map<string, number>;
};
export interface MessageEvent {
  type: "MESSAGE";
  payload: {
    message: string;
  };
}
export interface ResetEvent {
  type: "RESET";
}
export interface StartEvent {
  type: "START";
}
export interface StopEvent {
  type: "STOP";
}
export type Event = MessageEvent | ResetEvent | StartEvent | StopEvent;
export type State = {
  value: "idle" | "active";
  context: Context;
};

const machine = createMachine<Context, Event, State>(
  {
    initial: "idle",
    context: {
      words: new Map(),
    },
    states: {
      idle: {
        on: {
          START: {
            actions: "start",
            target: "active",
          },
        },
      },
      active: {
        on: {
          MESSAGE: {
            actions: "processMessage",
          },
          RESET: {
            actions: "reset",
          },
          STOP: "idle",
        },
      },
    },
  },
  {
    actions,
  }
);

export default machine;
