import {
  type ArmorTableData,
  type ItemTableData,
  type ModifierTableData,
  WeaponAttackType,
  type WeaponTableData
} from "@/types/db-types";

// region 解析结果类型

interface ParseFailRes {
  isSuccess: false;
  res: null;
}

interface ParseSuccessRes<T> {
  isSuccess: true;
  res: T;
}

export type ParseRes<T> = ParseFailRes | ParseSuccessRes<T>;

// endregion

// region 装备类型

export type EquipmentDirection = 'l' | 'r' | 't' | 'b';
// 装备 ID 格式：[装备索引][装备索引][装备方向]_[装备完整名称]
type EquipmentId = `${number}${number}${EquipmentDirection}_${string}`;

export enum EquipmentType {
  weapon = 'weapon',
  item = 'item',
  armor = 'armor',
  modifier = 'modifier',
}

export interface Equipment_Weapon {
  id: EquipmentId;
  rowIndex: number;
  colIndex: number;
  direction: EquipmentDirection;
  type: EquipmentType.weapon;
  fullLength: number;
  fullName: string;
  tableData: WeaponTableData;
  modifiers: Equipment_Modifier[];
}

export interface Equipment_Item {
  id: EquipmentId;
  rowIndex: number;
  colIndex: number;
  direction: EquipmentDirection;
  type: EquipmentType.item;
  fullLength: number;
  fullName: string;
  tableData: ItemTableData;
  modifiers: Equipment_Modifier[];
}

export interface Equipment_Armor {
  id: EquipmentId;
  rowIndex: number;
  colIndex: number;
  direction: EquipmentDirection;
  type: EquipmentType.armor;
  fullLength: number;
  fullName: string;
  tableData: ArmorTableData;
  modifiers: Equipment_Modifier[];
}

export interface Equipment_Modifier {
  type: EquipmentType.modifier;
  fullLength: number;
  fullName: string;
  tableData: ModifierTableData;
}

export type Equipment = Equipment_Weapon | Equipment_Item | Equipment_Armor;

// endregion

export enum CastTarget {
  self = 'self',
  enemy = 'enemy',
}

export interface WeaponRealTimeData {
  type: EquipmentType.weapon;
  power: number;
  castTarget: CastTarget;
  effectiveInterval: number;
  attackType: WeaponAttackType;
  lifeSteal: number;
  accumulatedValue_Fire: number;
  accumulatedValue_Ice: number;
  accumulatedValue_Bleeding: number;
}

export interface ItemRealTimeData {
  type: EquipmentType.item;
  effectiveInterval: number;
}

export interface ArmorRealTimeData {
  type: EquipmentType.armor;
}

export type EquipmentRealTimeData = WeaponRealTimeData | ItemRealTimeData | ArmorRealTimeData;