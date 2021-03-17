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

interface Context {
  channel: Channel | null;
  currentMonster: Monster | null;
}

type Event =
  | { type: "MESSAGE" }
  | { type: "CHAT_ATTACK" }
  | { type: "MONSTER_ATTACK" }
  | { type: "MANUAL_SPAWN" }
  | { type: "MANUAL_MONSTER_DEATH" };

type IdleContext = Context & {
  channel: null;
  currentMonster: null;
};

type ActiveContext = Context & {
  channel: Channel;
  currentMonster: Monster;
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

const monsters: Record<string, Monster> = {
  dan_hornet: {
    id: "dan_hornet",
    name: "Dan Hornet",
    health: 5,
    maxHealth: 5,
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
        invoke: {
          id: "incInterval",
          src: () => (callback) => {
            const id = setInterval(() => callback("MONSTER_ATTACK"), 2500);
            return () => clearInterval(id);
          },
        },
        on: {
          CHAT_ATTACK: [
            {
              target: "success",
              cond: { type: "monsterDead" },
              actions: "attackMonster",
            },
            {
              target: "active",
              actions: "attackMonster",
              internal: false,
            },
          ],
          MONSTER_ATTACK: [
            {
              target: "fail",
              cond: { type: "channelDead" },
              actions: "attackChannel",
            },
            {
              target: "active",
              actions: "attackChannel",
              internal: false,
            },
          ],
          MANUAL_MONSTER_DEATH: "idle",
        },
      },
      success: {
        after: {
          1000: "idle",
        },
      },
      fail: {
        after: {
          3000: "idle",
        },
      },
    },
  },
  {
    actions: {
      startEncounter: assign({
        currentMonster: { ...monsters.dan_hornet },
        channel: {
          health: 30,
          maxHealth: 30,
        },
      } as Context),
      attackChannel: assign({
        channel: ({ channel }) => {
          if (channel === null) {
            return null;
          }
          return {
            ...channel,
            health: channel.health - 1,
          };
        },
      }),
      attackMonster: assign({
        currentMonster: ({ currentMonster }) => {
          if (currentMonster === null) {
            return null;
          }
          return {
            ...currentMonster,
            health: currentMonster.health - 1,
          };
        },
      }),
    },
    guards: {
      channelDead: ({ channel }) => {
        if (channel === null) {
          return false;
        }
        return channel.health - 1 === 0;
      },
      monsterDead: ({ currentMonster }) => {
        if (currentMonster === null) {
          return false;
        }
        return currentMonster.health - 1 === 0;
      },
      triggerEncounter: () => {
        return Math.random() <= 0.5;
      },
    },
  }
);

export default monsterBattleMachine;
