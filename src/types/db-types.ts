import type { EquipmentRealTimeData } from "@/types/equipment-types";

export enum EquipmentAttackType {
  // 剑/刀 对随机敌人进行单体攻击
  sword = 'sword',
  // 棍/杖 选取随机敌人进行3x3范围攻击
  stick = 'stick',
  // 弓 优先攻击血量最少的敌人
  bow = 'bow',
  // 矛枪戟 优先攻击血量最高的敌人
  spear = 'spear',
  // 斧 优先攻击血量最高的敌人，并造成十字范围伤害
  axe = 'axe',
}

export interface WeaponTableData {
  name: string|string[];
  description: string;
  power: number;
  effectiveInterval: number;
  attackType: EquipmentAttackType;
  lifeSteal: number;
  accumulatedValue_Fire: number;
  accumulatedValue_Ice: number;
  accumulatedValue_Bleeding: number;
}


export interface ItemTableData {
  name: string|string[];
  description: string;
}

export interface ArmorTableData {
  name: string|string[];
  description: string;
}

export interface ModifierTableData {
  name: string|string[];
  description: string;
  modifier: (data: EquipmentRealTimeData) => EquipmentRealTimeData;
}

export type EquipmentTableData = WeaponTableData|ItemTableData|ArmorTableData;

export type TableData = WeaponTableData|ItemTableData|ArmorTableData|ModifierTableData;

export interface MatchNode {
  tableData: TableData|null;
  parent: MatchNode|null;
  derivative: Record<string, MatchNode> | null;
}

