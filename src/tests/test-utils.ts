import { EquipmentType } from "@/types/equipment-types";
import { getModifierTableData } from "@/db/db-helper";

export const transformStr = (str: string): string[] => {
  return str.split('').reverse();
}

export const generateModifier = (modifierName: string) => ({
  type: EquipmentType.modifier,
  fullName: modifierName,
  fullLength: modifierName.length,
  tableData: getModifierTableData(modifierName)
})