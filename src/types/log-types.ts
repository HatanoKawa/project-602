export enum LogType {
  equipmentAttack = 'equipmentAttack',
  elementalEffect = 'elementalEffect',
  gameStateChange = 'gameStateChange',
  enemyDie = 'enemyDie',
}

export interface EquipmentAttackLog {
  logType: LogType.equipmentAttack;
  equipmentId: string;
  equipmentName: string;
  target: string[];
  damage: number;
}

export interface ElementalEffectLog {
  logType: LogType.elementalEffect;
  elementalEffectName: string;
  elementalEffectColor: string;
  target: string[];
  damage: number;
}

export interface gameStateChangeLog {
  logType: LogType.gameStateChange;
  text: string;
}

export interface enemyDieLog {
  logType: LogType.enemyDie;
  enemyName: string;
}

export type LogData = EquipmentAttackLog | ElementalEffectLog | gameStateChangeLog | enemyDieLog;