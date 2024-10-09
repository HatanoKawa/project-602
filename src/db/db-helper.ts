import { tableData_Armor, tableData_Item, tableData_Modifier, tableData_Weapon } from "@/db";
import type { MatchNode, ModifierTableData, TableData, WeaponTableData } from "@/types/db-types";

// region 查询方法

export const getWeaponTableData = (name: string): WeaponTableData|null => {
  return tableData_Weapon.find((item) => typeof item.name === 'string' ? item.name === name : item.name.indexOf(name) > -1) || null;
}

export const getItemTableData = (name: string): TableData|null => {
  return tableData_Item.find((item) => typeof item.name === 'string' ? item.name === name : item.name.indexOf(name) > -1) || null;
}

export const getArmorTableData = (name: string): TableData|null => {
  return tableData_Armor.find((item) => typeof item.name === 'string' ? item.name === name : item.name.indexOf(name) > -1) || null;
}

export const getModifierTableData = (name: string): ModifierTableData|null => {
  return tableData_Modifier.find((item) => typeof item.name === 'string' ? item.name === name : item.name.indexOf(name) > -1) || null;
}

// endregion

// region 构建匹配树

export const buildMatchTree = (tableDataList: TableData[]) => {
  const matchTree: Record<string, MatchNode> = {};

  tableDataList.forEach((tableData) => {
    const nameList: string[] = typeof tableData.name === 'string' ? [tableData.name] : [...tableData.name];
    // 遍历每个名字，构建匹配树
    for (const name of nameList) {
      let curNode: MatchNode|null = null;
      let derivativeRecord: Record<string, MatchNode> = matchTree;
      // 从每个名字的最后一个字符开始，逐个向前构建匹配树
      for (let i = name.length - 1; i >= 0; i--) {
        const char = name[i];

        let nextNode: MatchNode|null = null;

        if (!derivativeRecord[char]) {
          // 如果当前节点没有这个字符的派生节点，就创建一个新的节点
          nextNode = {
            tableData: i === 0 ? tableData : null,
            parent: curNode,
            derivative: i === 0 ? null : {},
          }
        } else {
          // 如果当前节点有这个字符的派生节点，就直接使用这个节点
          nextNode = derivativeRecord[char];
          if (i === 0) {
            if (nextNode.tableData) {
              console.warn(`检测到重复的数据：[ ${tableData.name} ], 将会覆盖之前的数据`);
            }
            derivativeRecord[char].tableData = tableData;
          } else if (!nextNode.derivative) {
            nextNode.derivative = {};
          }
        }

        // 将新节点添加到当前节点的派生节点中
        derivativeRecord[char] = nextNode;

        if (i !== 0) {
          curNode = nextNode;
          derivativeRecord = nextNode.derivative!;
        }
      }
    }
  })

  return matchTree;
}

const getWholeCharSet = (tableDataList: TableData[]): Set<string> => {
  return new Set(
    tableDataList.map((data) => {
      return typeof data.name === 'string'
        ? data.name.split('')
        : data.name.map((name) => name.split(''))
    }).flat(2)
  );
}

export const weaponMatchTree = buildMatchTree(tableData_Weapon);
export const weaponBaseCharSet = new Set(Object.keys(weaponMatchTree));
export const weaponWholeCharSet = getWholeCharSet(tableData_Weapon);

export const itemMatchTree = buildMatchTree(tableData_Item);
export const itemBaseCharSet = new Set(Object.keys(itemMatchTree));
export const itemWholeCharSet = getWholeCharSet(tableData_Item);

export const armorMatchTree = buildMatchTree(tableData_Armor);
export const armorBaseCharSet = new Set(Object.keys(armorMatchTree));
export const armorWholeCharSet = getWholeCharSet(tableData_Armor);

export const modifierMatchTree = buildMatchTree(tableData_Modifier);
export const modifierBaseCharSet = new Set(Object.keys(modifierMatchTree));
export const modifierWholeCharSet = getWholeCharSet(tableData_Modifier);

// endregion

// 匹配的起始字符集合
export const matchBeginCharSet = new Set([...weaponBaseCharSet, ...itemBaseCharSet, ...armorBaseCharSet]);

// 匹配的字符集合
export const wholeCharSet = new Set([...weaponWholeCharSet, ...itemWholeCharSet, ...armorWholeCharSet, ...modifierWholeCharSet]);
export const wholeCharList = [...wholeCharSet];

