import type { ModifierTableData } from "@/types/db-types";
import { EquipmentType } from "@/types/equipment-types";

export const tableData_Modifier: ModifierTableData[] = [
  {
    name: ['锐', '利'],
    description: '攻击力*1.1 流血+10',
    modifier: (data) => {
      if (data.type === EquipmentType.weapon) {
        data.power *= 1.1;
        data.accumulatedValue_Bleeding += 10;
      }
      return data;
    }
  },
  {
    name: '长',
    description: '攻击力*1.2 攻击间隔*1.1',
    modifier: (data) => {
      if (data.type === EquipmentType.weapon) {
        data.power *= 1.2;
        data.effectiveInterval *= 1.1;
      }
      return data;
    }
  },
  {
    name: '火',
    description: '火属性伤害+10',
    modifier: (data) => {
      if (data.type === EquipmentType.weapon) {
        data.accumulatedValue_Fire += 10;
      }
      return data;
    }
  },
  {
    name: '冰',
    description: '冰属性伤害+10',
    modifier: (data) => {
      if (data.type === EquipmentType.weapon) {
        data.accumulatedValue_Ice += 10;
      }
      return data;
    }
  },
  {
    name: '锐利',
    description: '攻击力*1.6',
    modifier: (data) => {
      if (data.type === EquipmentType.weapon) {
        data.power *= 1.6;
        data.accumulatedValue_Bleeding += 50;
      }
      return data;
    }
  },
]

export default tableData_Modifier;