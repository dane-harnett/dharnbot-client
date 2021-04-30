import monsterLevels from "./monsterLevels";
import { Monster, MonsterType } from "../types";

const DAN_HORNET_LEVEL = 10;
const customMonsters: Record<string, Monster> = {
  dan_hornet: {
    type: MonsterType.Custom,
    id: "dan_hornet",
    level: DAN_HORNET_LEVEL,
    name: "Dan Hornet",
    health: monsterLevels[DAN_HORNET_LEVEL].maxHealth,
    maxHealth: monsterLevels[DAN_HORNET_LEVEL].maxHealth,
    description: "Watch out you might get stung!",
    credits: "Artwork courtesy of RetroMMO and fruloo",
  },
};

export default customMonsters;
