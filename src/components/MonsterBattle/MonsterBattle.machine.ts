import { createMachine, assign } from "xstate";

export interface Monster {
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
}

type Event =
  | { type: "MESSAGE" }
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
    },
    states: {
      idle: {
        on: {
          MESSAGE: [
            {
              target: "active",
              cond: { type: "triggerEncounter" },
              actions: "startEncounter",
            },
            {
              target: "idle",
            },
          ],
          MANUAL_SPAWN: {
            target: "active",
            actions: "startEncounter",
          },
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
      tick: assign({
        channel: ({ channel }) => {
          if (channel === null) {
            return channel;
          }
          return {
            ...channel,
            health: channel.health - 1,
          };
        },
        currentMonster: ({ currentMonster, currentAttackers }) => {
          if (currentMonster === null || currentAttackers === null) {
            return currentMonster;
          }
          return {
            ...currentMonster,
            health: currentMonster.health - currentAttackers.length,
          };
        },
      }),
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
      startEncounter: assign({
        currentAttackers: [],
        currentMonster: {
          ...monsters.dan_hornet,
        },
        channel: {
          ...baseChannel,
        },
      } as Context),
    },
    guards: {
      channelDead: ({ channel }) => {
        if (channel === null) {
          return false;
        }
        return channel.health - 1 === 0;
      },
      monsterDead: ({ currentMonster, currentAttackers }) => {
        if (currentMonster === null || currentAttackers === null) {
          return false;
        }
        return currentMonster.health - currentAttackers.length <= 0;
      },
      triggerEncounter: () => {
        return Math.random() <= 0.05;
      },
    },
  }
);

export default monsterBattleMachine;
