import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { matchBeginCharSet, wholeCharList } from "@/db/db-helper";
import { tryParse } from "@/utils/parser";
import type { Equipment, EquipmentDirection } from "@/types/equipment-types";
import { useGameCoreStore } from "@/stores/game-core";

export interface CharSlotData {
  char: string;
  // list of equipment id
  belongTo: string[];
  nextTo: string[];
}

export const useEquipmentStore = defineStore('equipment', () => {

  const gameCoreStore = useGameCoreStore();

  // region 汉字获取与交换相关逻辑

  // [rowIndex, colIndex]
  const currentOperatingCharIndex = ref([-1, -1]);
  const charTempStorage = ref<string[]>([]);
  const newCharToAddCount = ref(0);
  const canAddNewChar = computed(() => charTempStorage.value.some(char => !char));
  // whole 10x10 equipment map
  const charSlotList = ref<CharSlotData[][]>([]);

  const exchangeChar = (fromX: number, fromY: number, toX: number, toY: number) => {
    if (fromX < 0) {
      // exchange from temporary storage
      if (charSlotList.value[toX][toY].char) {
        console.warn('target slot is not empty');
        return;
      }
      if (fromX === -1) {
        charSlotList.value[toX][toY].char = charTempStorage.value.splice(fromY, 1, '')[0];
        gameCoreStore.tryLevelUp();
        addRandomNewChar();
      }
      if (fromX === -2) {
        charSlotList.value[toX][toY].char = recycleCharTempStorage.value[fromY];
        recycleGauge.value -= RECYCLE_CHAR_MAX;
        refreshRecycleCharTempStorage();
      }
    } else {
      // exchange from equipment list
      const fromChar = charSlotList.value[fromX][fromY].char;
      const toChar = charSlotList.value[toX][toY].char;
      charSlotList.value[fromX][fromY].char = toChar;
      charSlotList.value[toX][toY].char = fromChar;
    }

    regenerateEquipments(([[fromX, fromY], [toX, toY]].filter(pos => pos[0] >= 0)) as [number, number][]);
    // generateEquipments();
  };

  const addRandomNewChar = () => {
    while (newCharToAddCount.value > 0) {
      if (canAddNewChar.value) {
        for (let i = 0; i < charTempStorage.value.length; i++) {
          if (!charTempStorage.value[i]) {
            charTempStorage.value[i] = wholeCharList[Math.floor(Math.random() * wholeCharList.length)];
            break;
          }
        }
        newCharToAddCount.value--;
      } else {
        return;
      }
    }
  };
  
  const tryAddRandomNewChar = () => {
    newCharToAddCount.value++;
    addRandomNewChar();
  };
  
  // endregion

  // region 回收汉字相关逻辑

  // temporary storage for recycled characters, length is 5, rowIndex is -2
  const RECYCLE_CHAR_MAX = 5;
  const recycleGauge = ref(0);
  const canRecycle = computed(() => recycleGauge.value >= RECYCLE_CHAR_MAX);
  const canRefreshRecycleList = computed(() => recycleGauge.value > 0);
  const recycleCharTempStorage = ref<string[]>([]);
  const manuallyRefreshRecycleList = () => {
    if (canRefreshRecycleList.value) {
      recycleGauge.value--;
      refreshRecycleCharTempStorage();
    }
  };
  const refreshRecycleCharTempStorage = () => {
    recycleCharTempStorage.value = [];
    // 从汉字列表中随机抽取 5 个汉字填充到回收汉字列表中，且不重复
    while (recycleCharTempStorage.value.length < 5) {
      const randomChar = wholeCharList[Math.floor(Math.random() * wholeCharList.length)];
      if (!recycleCharTempStorage.value.includes(randomChar)) {
        recycleCharTempStorage.value.push(randomChar);
      }
    }
  };
  refreshRecycleCharTempStorage();

  const recycleChar = (fromX: number, fromY: number) => {
    if (fromX >= 0) {
      // recycle from char list
      charSlotList.value[fromX][fromY].char = '';
      regenerateEquipments([[fromX, fromY]]);
    } else if (fromX === -1) {
      // recycle from char gain temporary storage
      charTempStorage.value[fromY] = '';
    } else if (fromX === -2) {
      // recycle from recycle temporary storage
      // just do nothing
      recycleGauge.value -= RECYCLE_CHAR_MAX;
      refreshRecycleCharTempStorage();
    }
    recycleGauge.value++;
  };

  // endregion

  // region 装备更新相关逻辑

  const equipmentList = ref<Equipment[]>([]);

  // 返回值为 [左, 右, 上, 下] 四个方向的可能装备字符串，尽可能匹配最长的装备名称，遇到【边缘】或【空格】或【其他的装备起始字符】则停止
  const collectPossibleWords = (rowIndex: number, colIndex: number): [string, string, string, string] => {
    // find to left
    const startChar = charSlotList.value[rowIndex][colIndex].char;

    const findWords = (rowIndex: number, colIndex: number, dRowIndex: number, dColIndex: number): string => {
      let words = startChar;
      while (rowIndex >= 0 && rowIndex < 10 && colIndex >= 0 && colIndex < 10) {
        const nextChar = charSlotList.value[rowIndex][colIndex].char;
        if (matchBeginCharSet.has(nextChar) || nextChar === '') break;
        words = nextChar + words;
        rowIndex += dRowIndex;
        colIndex += dColIndex;
      }
      return words;
    };

    const wordsToLeft = findWords(rowIndex, colIndex - 1, 0, -1);
    const wordsToRight = findWords(rowIndex, colIndex + 1, 0, +1);
    const wordsToTop = findWords(rowIndex - 1, colIndex, -1, 0);
    const wordsToBottom = findWords(rowIndex + 1, colIndex, 1, 0);

    if (wordsToLeft.length > 1 || wordsToRight.length > 1 || wordsToTop.length > 1 || wordsToBottom.length > 1) {
      const wordsToReturn = [wordsToLeft, wordsToRight, wordsToTop, wordsToBottom];
      return wordsToReturn.map((item) => item.length > 1 ? item : '') as [string, string, string, string];
    } else {
      return [wordsToLeft, '', '', ''];
    }
  };

  // 从指定位置开始尝试向四个方向解析装备
  const tryFindEquipments = (rowIndex: number, colIndex: number) => {
    const wordsList = collectPossibleWords(rowIndex, colIndex);
    const resEquipmentList: Equipment[] = [];
    wordsList.forEach((words, wordsIndex) => {
      if (!words) return;
      const wordDirection: EquipmentDirection = ['l', 'r', 't', 'b'][wordsIndex] as EquipmentDirection;
      const parseRes = tryParse(words, [rowIndex, colIndex], wordDirection);
      if (parseRes) {
        resEquipmentList.push(parseRes);
      }
    });
    if (resEquipmentList.some(equipment => equipment.fullLength > 1)) {
      return resEquipmentList.filter(equipment => equipment.fullLength > 1);
    }
    return [resEquipmentList[0]];
  };
  
  // 排序装备列表，按照装备长度从大到小排序，长度相同的按照装备名称排序
  const sortEquipments = () => {
    equipmentList.value.sort((a, b) => {
      if (a.fullLength === b.fullLength) {
        return a.fullName.localeCompare(b.fullName);
      }
      return b.fullLength - a.fullLength;
    });
  };

  // 删除指定装备 ID 相关的相邻与从属关系
  const removeRelatedEquipments = (equipmentIds: Set<string>) => {
    // 遍历所有字符格，删除所有与本次移动相关的装备 ID
    charSlotList.value.forEach(row => {
      row.forEach(charSlot => {
        for(let i = charSlot.nextTo.length - 1; i >= 0; i--) {
          if (equipmentIds.has(charSlot.nextTo[i]))
            charSlot.nextTo.splice(i, 1);
        }
        for(let i = charSlot.belongTo.length - 1; i >= 0; i--) {
          if (equipmentIds.has(charSlot.belongTo[i]))
            charSlot.belongTo.splice(i, 1);
        }
        // charSlot.nextTo = charSlot.nextTo.filter(equipmentId => !equipmentIdToRemove.has(equipmentId));
        // charSlot.belongTo = charSlot.belongTo.filter(equipmentId => !equipmentIdToRemove.has(equipmentId));
      });
    });
    // 在装备列表中删除所有与本次移动相关的装备
    for (let i = equipmentList.value.length - 1; i >= 0; i--) {
      if (equipmentIds.has(equipmentList.value[i].id)) {
        equipmentList.value.splice(i, 1);
      }
    }
  };
  
  // 重新生成装备列表
  const regenerateEquipments = (relatedPos: [number, number][]) => {

    // 收集所有需要删除的装备 ID
    const equipmentIdToRemove: Set<string> = new Set<string>();
    relatedPos.forEach(pos => {
      const charSlot = charSlotList.value[pos[0]][pos[1]];
      charSlot.belongTo.forEach(equipmentId => equipmentIdToRemove.add(equipmentId));
    });

    removeRelatedEquipments(equipmentIdToRemove);

    // 生成装备列表
    generateEquipments();
  };

  const mergeEquipments = (targetEquipments: Equipment[]) => {
    const equipmentsToRemove: Set<string> = new Set<string>();
    const equipmentsToAdd: Equipment[] = [...targetEquipments];
    // 移除待添加列表中重复的装备，移除系统中装备列表不应存在的装备
    for (let i = equipmentList.value.length - 1; i >= 0; i--) {
      const equipmentId = equipmentList.value[i].id;
      const targetIndex = equipmentsToAdd.findIndex(equipment => equipment.id === equipmentId);
      if (targetIndex >= 0) {
        // 如果待添加列表中存在相同的装备，则移除
        equipmentsToAdd.splice(targetIndex, 1);
      } else {
        // 如果系统中存在的装备不在待添加列表中，说明此装备已经不再存在，需要移除
        equipmentsToRemove.add(equipmentId);
        equipmentList.value.splice(i, 1);
      }
    }

    // 移除不再存在的装备的相邻与从属关系
    removeRelatedEquipments(equipmentsToRemove);

    // 合并待添加列表到系统中
    equipmentsToAdd.forEach(equipment => {
      equipmentList.value.push(equipment);
      setBelongAndNextTo(equipment);
    });
    sortEquipments();
  };

  // 生成装备列表
  const generateEquipments = () => {
    const tempEquipmentList: Equipment[] = [];
    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
      for (let colIndex = 0; colIndex < 10; colIndex++) {
        if (matchBeginCharSet.has(charSlotList.value[rowIndex][colIndex].char)) {
          // 当前位置是装备的起始位置
          // todo 由于Item与Armor的parser还未完成，所以返回值可能为空数组，需要过滤掉
          // tempEquipmentList.push(...tryFindEquipments(rowIndex, colIndex));
          tempEquipmentList.push(...tryFindEquipments(rowIndex, colIndex).filter(equipment => equipment));
        }
      }
    }
    mergeEquipments(tempEquipmentList);
    // console.log('equipmentList', equipmentList.value);
  };

  // 根据目标位置、方向、装备 ID，设置装备两侧的相邻关系
  const setNextTo = (curPos: [number, number], direction: EquipmentDirection, equipmentId: string) => {
    switch (direction) {
    case "l":
    case "r":
      // 如果是左右方向匹配，则当前位置的上下两个位置相邻于此装备
      if (curPos[0] - 1 >= 0)
        charSlotList.value[curPos[0] - 1][curPos[1]].nextTo.push(equipmentId);
      if (curPos[0] + 1 < 10)
        charSlotList.value[curPos[0] + 1][curPos[1]].nextTo.push(equipmentId);
      break;
    case "t":
    case "b":
      // 如果是上下方向匹配，则当前位置的左右两个位置相邻于此装备
      if (curPos[1] - 1 >= 0)
        charSlotList.value[curPos[0]][curPos[1] - 1].nextTo.push(equipmentId);
      if (curPos[1] + 1 < 10)
        charSlotList.value[curPos[0]][curPos[1] + 1].nextTo.push(equipmentId);
      break;
    }
  };

  const setBelongAndNextTo = (equipmentData: Equipment) => {
    const { rowIndex, colIndex, direction, fullLength: equipmentLength, id: equipmentId } = equipmentData;
    const curPos: [number, number] = [rowIndex, colIndex];
    let lastCount = equipmentLength;
    // region 反推出前一个位置，若前一个位置存在，则前一个位置相邻于此装备
    const posBefore: [number, number] = [rowIndex, colIndex];
    switch (direction) {
    case "l": posBefore[1]++; break;
    case "r": posBefore[1]--; break;
    case "t": posBefore[0]++; break;
    case "b": posBefore[0]--; break;
    }
    if (posBefore[0] >= 0 && posBefore[0] < 10 && posBefore[1] >= 0 && posBefore[1] < 10) {
      charSlotList.value[posBefore[0]][posBefore[1]].nextTo.push(equipmentId);
    }
    // endregion

    while (lastCount >= 0) {
      // 设置当前位置的相邻和从属关系
      if (lastCount === 0) {
        // 已经匹配结束，则当前位置若合法便相邻于此装备
        if (curPos[0] >= 0 && curPos[0] < 10 && curPos[1] >= 0 && curPos[1] < 10) {
          charSlotList.value[curPos[0]][curPos[1]].nextTo.push(equipmentId);
        }
      } else {
        // 未匹配结束，则当前位置属于此装备
        charSlotList.value[curPos[0]][curPos[1]].belongTo.push(equipmentId);
        // 设置两侧相邻
        setNextTo(curPos, direction, equipmentId);
      }
      // 根据方向，推进到下一个位置
      switch (direction) {
      case 'l': curPos[1]--; break;
      case 'r': curPos[1]++; break;
      case 't': curPos[0]--; break;
      case 'b': curPos[0]++; break;
      }
      lastCount--;
    }
  };

  // endregion
  
  // region 装备高亮相关逻辑  
  
  const currentHighlightEquipmentId= ref('');
  const highlightEquipment = (equipmentId: string) => {
    currentHighlightEquipmentId.value = equipmentId;
  };
  const unHighlightEquipment = () => {
    currentHighlightEquipmentId.value = '';
  };
  
  // endregion

  // region 主动装备行动逻辑

  const effectiveGaugeIncreaseFunctionDict: Record<symbol, (val: number) => void> = {};
  const increaseAllEffectiveGauge = (increaseValue: number) => {
    Object.getOwnPropertySymbols(effectiveGaugeIncreaseFunctionDict).forEach((key) => {
      effectiveGaugeIncreaseFunctionDict[key](increaseValue);
    });
  };

  const addEffectiveGauge = (effectiveGauge: (val: number) => void) => {
    const key = Symbol();
    effectiveGaugeIncreaseFunctionDict[key] = effectiveGauge;
    return key;
  };

  const removeEffectiveGauge = (key: symbol) => {
    delete effectiveGaugeIncreaseFunctionDict[key];
  };

  // endregion

  const init = () => {
    charTempStorage.value = Array.from({ length: 10 }, () => "");
    charSlotList.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ char: '', nextTo: [], belongTo: [] })));

    newCharToAddCount.value = 10;
    addRandomNewChar();
  };
  init();
  
  const gameFlushHandler = (increaseTime: number) => {
    increaseAllEffectiveGauge(increaseTime);
  };

  return {
    RECYCLE_CHAR_MAX,

    canAddNewChar,
    newCharToAddCount,
    charTempStorage,
    charSlotList,
    currentOperatingCharIndex,
    equipmentList,
    currentHighlightEquipmentId,
    recycleGauge,
    canRecycle,
    canRefreshRecycleList,
    recycleCharTempStorage,

    addRandomNewChar,
    tryAddRandomNewChar,
    exchangeChar,
    highlightEquipment,
    unHighlightEquipment,
    recycleChar,
    manuallyRefreshRecycleList,

    // region 主动装备行动逻辑
    addEffectiveGauge,
    increaseAllEffectiveGauge,
    removeEffectiveGauge,
    // endregion

    gameFlushHandler,
  };
});