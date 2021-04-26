import { createMachine, assign } from "xstate";

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

interface Channel {
  health: number;
  maxHealth: number;
}

interface User {
  login: string;
  profile_image_url: string;
}

interface Context {
  channel: Channel | null;
  currentMonster: Monster | null;
  currentAttackers: User[] | null;
  startingTimer: number;
}

type Event =
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

type IdleContext = Context & {
  channel: null;
  currentMonster: null;
  currentAttackers: null;
};

type ActiveContext = Context & {
  channel: Channel;
  currentMonster: Monster;
  currentAttackers: User[];
};

type State =
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

const baseChannel = {
  health: 30,
  maxHealth: 30,
};
const monsters: Record<string, Monster> = {
  dan_hornet: {
    type: MonsterType.Custom,
    id: "dan_hornet",
    name: "Dan Hornet",
    health: 45,
    maxHealth: 45,
    description: "Watch out you might get stung!",
    credits: "Artwork courtesy of RetroMMO and fruloo",
  },
};

const monsterBattleMachine = createMachine<Context, Event, State>(
  {
    initial: "idle",
    context: {
      channel: null,
      currentMonster: null,
      currentAttackers: null,
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
    actions: {
      tick: assign(({ channel, currentMonster, currentAttackers }) => ({
        channel:
          channel === null
            ? channel
            : {
                ...channel,
                health: channel.health - 1,
              },
        currentMonster:
          currentMonster === null || currentAttackers === null
            ? currentMonster
            : {
                ...currentMonster,
                health: currentMonster.health - currentAttackers.length,
              },
      })),
      addAttacker: assign({
        currentAttackers: ({ currentAttackers }, evt) => {
          if (currentAttackers === null) {
            return null;
          }
          if (evt.type === "CHAT_ATTACK") {
            const existingAttacker = currentAttackers.find((user) => {
              return user.login === evt.payload.user.login;
            });
            if (existingAttacker) {
              return currentAttackers;
            }
            return currentAttackers.concat([evt.payload.user]);
          }
          return currentAttackers;
        },
      }),
      startEncounter: assign((_ctx, evt) => {
        if (evt.type === "MESSAGE") {
          const emoteId = Object.keys(evt.payload.message.context.emotes)[0];
          const emoteData = evt.payload.message.context.emotes[emoteId];
          const startIndex = parseInt(emoteData[0].split("-")[0], 10);
          const endIndex = parseInt(emoteData[0].split("-")[1], 10);
          const emoteName = evt.payload.message.message.substring(
            startIndex,
            endIndex + 1
          );
          return {
            currentAttackers: [],
            currentMonster: {
              type: MonsterType.Emote,
              id: emoteId,
              name: emoteName,
              health: 45,
              maxHealth: 45,
              description: "",
              credits: "",
            },
            channel: {
              ...baseChannel,
            },
            startingTimer: 0,
          } as Context;
        }
        return {
          currentAttackers: [],
          currentMonster: {
            ...monsters.dan_hornet,
          },
          channel: {
            ...baseChannel,
          },
          startingTimer: 0,
        } as Context;
      }),
      incrementStartingTimer: assign((ctx) => {
        return {
          ...ctx,
          startingTimer: ctx.startingTimer + 1,
        };
      }),
    },
    guards: {
      channelDead: ({ channel }) => {
        if (channel === null) {
          return false;
        }
        return channel.health - 1 <= 0;
      },
      monsterDead: ({ currentMonster, currentAttackers }) => {
        if (currentMonster === null || currentAttackers === null) {
          return false;
        }
        return currentMonster.health - currentAttackers.length <= 0;
      },
      triggerEncounter: (_ctx, evt) => {
        const isEmoteInMessage =
          evt.type === "MESSAGE" && evt.payload.message.context.emotes !== null;
        const isRandomInRange = Math.random() <= 1;
        return isEmoteInMessage && isRandomInRange;
      },
      startingTimerLessThan5: ({ startingTimer }) => startingTimer < 5,
    },
  }
);

export default monsterBattleMachine;
