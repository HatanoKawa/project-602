import type { ArmorTableData, ItemTableData, ModifierTableData, WeaponTableData } from "@/types/db-types";

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

export enum EquipmentType {
  weapon = 'weapon',
  item = 'item',
  armor = 'armor',
  modifier = 'modifier',
}

export interface Equipment_Weapon {
  type: EquipmentType.weapon;
  fullLength: number;
  fullName: string;
  tableData: WeaponTableData;
  modifiers: Equipment_Modifier[];
}

export interface Equipment_Item {
  type: EquipmentType.item;
  fullLength: number;
  fullName: string;
  tableData: ItemTableData;
  modifiers: Equipment_Modifier[];
}

export interface Equipment_Armor {
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

export type Equipment = Equipment_Weapon | Equipment_Item | Equipment_Armor | Equipment_Modifier;

