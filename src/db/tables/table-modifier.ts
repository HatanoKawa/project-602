import type { ModifierTableData } from "@/types/db-types";

export const tableData_Modifier: ModifierTableData[] = [
  {
    name: ['锐', '利'],
    description: '',
    modifier: (data) => {
      // if (data.type === PropsType.weapon) {
      //   data.power *= 1.1;
      //   data.accumulatedValue_Bleeding += 10;
      // }
      return data;
    }
  },
  {
    name: '长',
    description: '',
    modifier: (data) => {
      // if (data.type === PropsType.weapon) {
      //   data.power *= 1.2;
      //   data.attackInterval *= 0.9;
      // }
      return data;
    }
  },
  {
    name: '火',
    description: '',
    modifier: (data) => {
      // if (data.type === PropsType.weapon) {
      //   data.accumulatedValue_Fire += 10;
      // }
      return data;
    }
  },
  {
    name: '冰',
    description: '',
    modifier: (data) => {
      // if (data.type === PropsType.weapon) {
      //   data.accumulatedValue_Ice += 10;
      // }
      return data;
    }
  },
  {
    name: '锐利',
    description: '',
    modifier: (data) => {
      // if (data.type === PropsType.weapon) {
      //   data.power *= 1.6;
      //   data.accumulatedValue_Bleeding += 50;
      // }
      return data;
    }
  },
]

export default tableData_Modifier;