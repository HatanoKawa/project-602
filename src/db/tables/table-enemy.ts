import type { EnemyTableData } from '@/types/enemy-types';

export const tableData_Enemy: EnemyTableData[] = [
  {
    name: 'Slime',
    description: 'A slime that can be found in the forest. It is weak against fire.',
    healthMax: 100,
    elementalGaugeMax_Fire: 100,
    elementalGaugeMax_Ice: 100,
    elementalGaugeMax_Bleeding: 100,
    xpReward: 100,
    rank: 0
  },
  {
    name: 'Goblin',
    description: 'A goblin that can be found in the forest. It is weak against ice.',
    healthMax: 200,
    elementalGaugeMax_Fire: 200,
    elementalGaugeMax_Ice: 200,
    elementalGaugeMax_Bleeding: 200,
    xpReward: 200,
    rank: 1
  },
  {
    name: 'Orc',
    description: 'An orc that can be found in the forest. It is weak against bleeding.',
    healthMax: 300,
    elementalGaugeMax_Fire: 300,
    elementalGaugeMax_Ice: 300,
    elementalGaugeMax_Bleeding: 300,
    xpReward: 300,
    rank: 2
  }
];

export default tableData_Enemy;