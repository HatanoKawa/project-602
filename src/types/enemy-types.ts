export interface EnemyTableData {
  name: string;
  description: string;
  healthMax: number;
  elementalGaugeMax_Fire: number;
  elementalGaugeMax_Ice: number;
  elementalGaugeMax_Bleeding: number;
  xpReward: number;
  rank: number;
}

export interface EnemyRealTimeData {
  health: number;
  healthMax: number;
  elementalGauge_Fire: number;
  elementalGauge_Ice: number;
  elementalGauge_Bleeding: number;
  tableData: EnemyTableData;
}