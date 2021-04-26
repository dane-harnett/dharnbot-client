import { createMachine } from "xstate";
import * as actions from "./actions";
import * as guards from "./guards";
import { Context, Event, State } from "../types";

const monsterBattleMachine = createMachine<Context, Event, State>(
  {
    initial: "idle",
    context: {
      channel: null,
      currentMonster: null,
      currentAttackers: null,
      currentDefenders: null,
      currentHealers: null,
      startingTimer: 0,
    },
    states: {
      idle: {
        on: {
          MESSAGE: [
            {
              target: "starting",
              cond: { type: "triggerEncounter" },
              actions: "startEncounter",
            },
            {
              target: "idle",
            },
          ],
          MANUAL_SPAWN: {
            target: "starting",
            actions: "startEncounter",
          },
        },
      },
      starting: {
        after: {
          1000: [
            {
              cond: { type: "startingTimerLessThan5" },
              target: "starting",
              internal: false,
              actions: "incrementStartingTimer",
            },
            {
              target: "active",
            },
          ],
        },
        on: {
          CHAT_ATTACK: [
            {
              target: "starting",
              actions: "addAttacker",
            },
          ],
          CHAT_DEFEND: [
            {
              target: "starting",
              actions: "addDefender",
            },
          ],
          CHAT_HEAL: [
            {
              target: "starting",
              actions: "addHealer",
            },
          ],
        },
      },
      active: {
        onEntry: "tick",
        invoke: {
          id: "incInterval",
          src: () => (callback) => {
            const id = setInterval(() => callback("TICK"), 1000);
            return () => clearInterval(id);
          },
        },
        on: {
          TICK: [
            {
              target: "success",
              cond: { type: "monsterDead" },
            },
            {
              target: "fail",
              cond: { type: "channelDead" },
            },
            {
              target: "active",
              internal: false,
            },
          ],
          CHAT_ATTACK: [
            {
              target: "active",
              actions: "addAttacker",
            },
          ],
          CHAT_DEFEND: [
            {
              target: "active",
              actions: "addDefender",
            },
          ],
          CHAT_HEAL: [
            {
              target: "active",
              actions: "addHealer",
            },
          ],
          MANUAL_MONSTER_DEATH: "idle",
        },
      },
      success: {
        onEntry: "tick",
        after: {
          1000: "idle",
        },
      },
      fail: {
        onEntry: "tick",
        after: {
          3000: "idle",
        },
      },
    },
  },
  {
    actions,
    guards,
  }
);

export default monsterBattleMachine;
