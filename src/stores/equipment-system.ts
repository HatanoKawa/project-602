import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { matchBeginCharSet, wholeCharList } from "@/db/db-helper";
import { tryParse } from "@/utils/parser";
import type { Equipment } from "@/types/equipment-types";

interface CharSlotData {
  char: string;
  // list of equipment id
  belongTo: string[];
  nextTo: string[];
}

export const useEquipmentSystem = defineStore("equipment-system", () => {

  // region 汉字获取与交换相关逻辑
  
  const CHAR_GAIN_GAUGE_MAX = 100;
  
  const currentOperatingCharIndex = ref([-1, -1]);
  const level = ref(1);
  const currentCharGainGaugeMax = computed(() => {
    return level.value * CHAR_GAIN_GAUGE_MAX;
  })
  const charGainPoint = ref(0);

  // temporary storage for equipment, length is 10
  const charTempStorage = ref<string[]>([])
  // whole 10x10 equipment map
  const charList = ref<CharSlotData[][]>([])
  
  const getNewChar = () => {
    for (let i = 0; i < charTempStorage.value.length; i++) {
      if (!charTempStorage.value[i]) {
        charTempStorage.value[i] = wholeCharList[Math.floor(Math.random() * wholeCharList.length)]
        return
      }
    }
  }

  const exchangeChar = (fromX: number, fromY: number, toX: number, toY: number) => {
    if (fromX < 0) {
      // exchange from temporary storage
      if (charList.value[toX][toY].char) {
        console.warn('target slot is not empty')
        return
      }
      charList.value[toX][toY].char = charTempStorage.value.splice(fromY, 1, '')[0]
    } else {
      // exchange from equipment list
      const fromChar = charList.value[fromX][fromY].char
      const toChar = charList.value[toX][toY].char
      charList.value[fromX][fromY].char = toChar
      charList.value[toX][toY].char = fromChar
    }

    generateEquipments()
  }

  const addCharGainPoint = (val: number) => {
    charGainPoint.value += val
    while (charGainPoint.value >= currentCharGainGaugeMax.value) {
      levelUp()
    }
  }
  
  // endregion
  
  const collectPossibleWords = (posX: number, posY: number): string[] => {
    // find to left
    const startChar = charList.value[posX][posY].char

    const findWords = (x: number, y: number, dx: number, dy: number): string => {
      let words = startChar;
      while (x >= 0 && x < 10 && y >= 0 && y < 10) {
        const nextChar = charList.value[x][y].char;
        if (matchBeginCharSet.has(nextChar) || nextChar === '') break;
        words = nextChar + words;
        x += dx;
        y += dy;
      }
      return words;
    };

    const wordsToLeft = findWords(posX - 1, posY, -1, 0);
    const wordsToRight = findWords(posX + 1, posY, 1, 0);
    const wordsToTop = findWords(posX, posY - 1, 0, -1);
    const wordsToBottom = findWords(posX, posY + 1, 0, 1);
    
    if (wordsToLeft.length > 1 || wordsToRight.length > 1 || wordsToTop.length > 1 || wordsToBottom.length > 1) {
      const wordsToReturn = [wordsToLeft, wordsToRight, wordsToTop, wordsToBottom]
      return wordsToReturn.filter((item) => item.length > 1)
    } else {
      return [wordsToLeft]
    }
  }
  
  const tryFindEquipments = (posX: number, posY: number) => {
    const wordsList = collectPossibleWords(posX, posY)
    const resEquipmentList: Equipment[] = []
    // console.warn(wordsList)
    wordsList.forEach(words => {
      const parseRes = tryParse(words)
      if (parseRes) {
        resEquipmentList.push(parseRes)
      }
    })
    if (resEquipmentList.some(equipment => equipment.fullLength > 1)) {
      // console.warn(resEquipmentList.filter(equipment => equipment.fullLength > 1))
      return resEquipmentList.filter(equipment => equipment.fullLength > 1)
    }
    // console.warn([resEquipmentList[0]])
    return [resEquipmentList[0]]
  }
  
  const generateEquipments = () => {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (matchBeginCharSet.has(charList.value[x][y].char)) {
          // 当前位置是装备的起始位置
          tryFindEquipments(x, y)
        }
      }
    }
  }

  const levelUp = () => {
    level.value++
    charGainPoint.value = 0
    getNewChar()
  }

  const resetPlayerState = () => {
    level.value = 1;
    charGainPoint.value = 0;
    charTempStorage.value = Array.from({ length: 10 }, () => "");
    charList.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ char: '', nextTo: [], belongTo: [] })));
  }
  resetPlayerState()

  return {
    level,
    currentCharGainGaugeMax,
    charGainPoint,
    charTempStorage,
    charList,
    currentOperatingCharIndex,

    resetPlayerState,
    getNewChar,
    levelUp,
    addCharGainPoint,
    exchangeChar,
  }
})