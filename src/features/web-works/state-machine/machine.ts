import { createMachine } from "xstate";

type Context = void;
type Event = { type: "ACTIVATE" };

const machine = createMachine<Context, Event>({
  initial: "idle",
  states: {
    idle: {
      on: {
        ACTIVATE: "displaying",
      },
    },
    displaying: {
      after: {
        3000: "idle",
      },
    },
  },
});

export default machine;
