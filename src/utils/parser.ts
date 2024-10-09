import {
  type ParseRes,
  type Equipment,
  type Equipment_Armor,
  type Equipment_Item,
  type Equipment_Modifier,
  type Equipment_Weapon,
  EquipmentType
} from "@/types/equipment-types";
import type { MatchNode, ModifierTableData, TableData, WeaponTableData } from "@/types/db-types";
import {
  armorBaseCharSet,
  itemBaseCharSet,
  matchBeginCharSet,
  modifierBaseCharSet,
  modifierMatchTree,
  weaponBaseCharSet,
  weaponMatchTree,
  wholeCharSet
} from "@/db/db-helper";

export const tryParseModifier = (matchList: string[]): ParseRes<Equipment_Modifier> => {
  const nextChar = matchList[0];
  if (modifierBaseCharSet.has(nextChar)) {
    let curTableData: TableData|null = modifierMatchTree[nextChar].tableData;
    let curMatchNode: MatchNode = modifierMatchTree[nextChar];
    let fullName = nextChar;
    let tempName = nextChar;
    for (let i = 1; i < matchList.length; i++) {
      const char = matchList[i];
      if (!curMatchNode.derivative || !curMatchNode.derivative[char]) {
        // 如果没有这个字符的派生节点，则修饰符的匹配终止
        break
      } else {
        // 如果有这个字符的派生节点，则继续向下匹配
        tempName = char + tempName;
        curMatchNode = curMatchNode.derivative[char]!;
        if (curMatchNode.tableData) {
          fullName = tempName;
          curTableData = curMatchNode.tableData;
        }
      }
    }

    if (curTableData) {
      matchList.splice(0, fullName.length);
      return {
        isSuccess: true,
        res: {
          type: EquipmentType.modifier,
          fullName,
          fullLength: fullName.length,
          tableData: curTableData as ModifierTableData,
        }
      }
    }
  }
  return {
    isSuccess: false,
    res: null,
  }
}

export const tryParseAsWeapon = (matchList: string[]): ParseRes<Equipment_Weapon> => {
  const nextChar = matchList[0];
  if (weaponBaseCharSet.has(nextChar)) {
    let curTableData: TableData|null = weaponMatchTree[nextChar].tableData;
    let curMatchNode: MatchNode = weaponMatchTree[nextChar];
    let fullName = nextChar;
    let tempName = nextChar;
    // let weaponLength = 1;
    // let charCount = 0;
    const modifierList: Equipment_Modifier[] = [];
    matchList.shift();
    while (matchList.length > 0) {
      const char = matchList[0];
      if (!curMatchNode.derivative || !curMatchNode.derivative[char]) {
        // 如果没有这个字符的派生节点，则判断是否可以插入修饰符
        if (curMatchNode.tableData) {
          // 如果当前节点有数据，则判定为可以插入修饰符的位置，尝试匹配修饰符
          const modifierRes = tryParseModifier(matchList);
          if (modifierRes.isSuccess) {
            // 如果匹配到了修饰符，则继续执行匹配
            modifierList.push(modifierRes.res);
            tempName = modifierRes.res.fullName + tempName;
            fullName = tempName;
            continue;
          }
          // 如果没有匹配到修饰符，则武器的匹配失败
          break;
        }
        // 如果当前节点没有对应的表格数据，则判定为不可插入修饰符的位置，匹配失败
        break;
      } else {
        // charCount++;
        tempName = char + tempName;
        // 如果有这个字符的派生节点，则继续向下匹配
        curMatchNode = curMatchNode.derivative[char]!;
        if (curMatchNode.tableData) {
          fullName = tempName;
          // weaponLength = charCount + 1;
          curTableData = curMatchNode.tableData;
        }
        matchList.shift();
      }
    }

    if (curTableData) {
      return {
        isSuccess: true,
        res: {
          type: EquipmentType.weapon,
          fullName,
          fullLength: fullName.length,
          tableData: curTableData as WeaponTableData,
          modifiers: modifierList,
        }
      }
    }
  }

  return {
    isSuccess: false,
    res: null,
  };
}

const tryParseAsItem = (matchList: string[]): ParseRes<Equipment_Item> => {
  console.error('tryParseAsItem is not implemented yet', matchList);
  return {
    isSuccess: false,
    res: null,
  };
}

const tryParseAsArmor = (matchList: string[]): ParseRes<Equipment_Armor> => {
  console.error('tryParseAsArmor is not implemented yet', matchList);
  return {
    isSuccess: false,
    res: null,
  };
}

export const tryParse = (inputStr: string): Equipment|null => {
  const listToMatch = inputStr.split('').reverse();

  const matchWeaponRes = tryParseAsWeapon(listToMatch);
  if (matchWeaponRes.isSuccess) {
    return matchWeaponRes.res!;
  }

  const matchItemRes = tryParseAsItem(listToMatch);
  if (matchItemRes.isSuccess) {
    return matchItemRes.res!;
  }

  const matchArmorRes = tryParseAsArmor(listToMatch);
  if (matchArmorRes.isSuccess) {
    return matchArmorRes.res!;
  }

  return null;
}

// export const tryParse = (inputStr: string): Prop[] => {
//   const parseRes = tryParseOnOneDirection(inputStr);
//   const parseResReverse = tryParseOnOneDirection(inputStr.split('').reverse().join(''));
//   return [parseRes, parseResReverse].filter((res) => res != null) as Prop[];
// }

const DEBUG_printCharSet = () => {
  console.log('weaponBaseCharSet', weaponBaseCharSet);
  console.log('itemBaseCharSet', itemBaseCharSet);
  console.log('armorBaseCharSet', armorBaseCharSet);
  console.log('modifierBaseCharSet', modifierBaseCharSet);
  console.log('matchBeginCharSet', matchBeginCharSet);
  console.log('wholeCharSet', wholeCharSet);
}

// DEBUG_printCharSet()

const DEBUG = () => {
  console.log(tryParseAsWeapon('剑'.split('').reverse()))
  console.log(tryParseAsWeapon('长剑'.split('').reverse()))
  console.log(tryParseAsWeapon('偃月刀'.split('').reverse()))
  console.log(tryParseAsWeapon('长长长青龙锐利偃月火刀'.split('').reverse()))
}

// DEBUG()