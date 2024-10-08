import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface CharSlotData {
  char: string;
  // list of equipment id
  belongTo: string[];
  nextTo: string[];
}

export const useEquipmentSystem = defineStore("equipment-system", () => {

  const CHAR_GAIN_GAUGE_MAX = 100;

  const level = ref(1);
  const currentCharGainGaugeMax = computed(() => {
    return level.value * CHAR_GAIN_GAUGE_MAX;
  })
  const charGainPoint = ref(0);

  // temporary storage for equipment, length is 10
  const charTempStorage = ref<string[]>([])
  // whole 10x10 equipment map
  const charList = ref<CharSlotData[][]>([])

  const resetPlayerState = () => {
    level.value = 1;
    charGainPoint.value = 0;
    charTempStorage.value = Array.from({ length: 10 }, () => "");
    charList.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ char: '', nextTo: [], belongTo: [] })));
  }

  const getNewChar = () => {
    // todo add new equipment to temporary storage
    console.warn('get 1 equipment')
  }

  const levelUp = () => {
    level.value++
    charGainPoint.value = 0
    getNewChar()
  }

  const addEquipmentGainPoint = (val: number) => {
    charGainPoint.value += val
    while (charGainPoint.value >= currentCharGainGaugeMax.value) {
      levelUp()
    }
  }

  resetPlayerState()

  return {
    level,
    currentCharGainGaugeMax,
    // currentGaugeMax: currentCharGainGaugeMax,
    charGainPoint,
    // equipmentGainGauge: charGainPoint,
    charTempStorage,
    // equipmentTemporaryStorage: charTempStorage,
    charList,
    // equipmentList: charList,

    resetPlayerState,
    getNewChar,
    levelUp,
    addEquipmentGainPoint
  }
})