import { defineStore } from "pinia";
import { ref } from "vue";
import { type LogData, LogType } from "@/types/log-types";

export enum ElementalEffectType {
  Ignite = 'Ignite',
  Freeze = 'Freeze',
  Bleeding = 'Bleeding',
}

export const useLogStore = defineStore('log', () => {
  const fullLogList = ref<LogData[]>([]);
  const logListToAdd = ref<LogData[]>([]);
  
  const damageAnalysis = ref<{ [key: string]: number }>({
    weapon: 0,
    elemental_Ignite: 0,
    elemental_Freeze: 0,
    elemental_Bleeding: 0,
  });

  const addEquipmentAttackLog = (equipmentId: string, equipmentName: string, target: string[], damage: number) => {
    damageAnalysis.value.weapon += damage;
    
    fullLogList.value.push({
      logType: LogType.equipmentAttack,
      equipmentId,
      equipmentName,
      target,
      damage,
    });
    logListToAdd.value.push({
      logType: LogType.equipmentAttack,
      equipmentId,
      equipmentName,
      target,
      damage,
    });
  };
  
  const addElementalEffectLog = (type: ElementalEffectType, elementalEffectName: string, elementalEffectColor: string, target: string[], damage: number) => {
    switch (type) {
    case ElementalEffectType.Ignite:
      damageAnalysis.value.elemental_Ignite += damage;
      break;
    case ElementalEffectType.Freeze:
      damageAnalysis.value.elemental_Freeze += damage;
      break;
    case ElementalEffectType.Bleeding:
      damageAnalysis.value.elemental_Bleeding += damage;
      break;
    }
    
    fullLogList.value.push({
      logType: LogType.elementalEffect,
      elementalEffectName,
      elementalEffectColor,
      target,
      damage,
    });
    logListToAdd.value.push({
      logType: LogType.elementalEffect,
      elementalEffectName,
      elementalEffectColor,
      target,
      damage,
    });
  };
  
  const addGameStateChangeLog = (text: string) => {
    fullLogList.value.push({
      logType: LogType.gameStateChange,
      text,
    });
    logListToAdd.value.push({
      logType: LogType.gameStateChange,
      text,
    });
  };
  
  const addEnemyDieLog = (enemyName: string) => {
    fullLogList.value.push({
      logType: LogType.enemyDie,
      enemyName,
    });
    logListToAdd.value.push({
      logType: LogType.enemyDie,
      enemyName,
    });
  };

  const scrollToBottom = ref<(() => void) | null>(null);
  
  const setScrollToBottomFn = (scrollFn: () => void) => {
    scrollToBottom.value = scrollFn;
  };
  
  const gameFlushHandler = (increaseTime: number) => {
    // if (scrollToBottom.value) {
    //   const tempFn = scrollToBottom.value;
    //   setTimeout(() => {
    //     tempFn();
    //   });
    // }
  };
  
  return {
    fullLogList,
    logListToAdd,

    damageAnalysis,

    addEquipmentAttackLog,
    addElementalEffectLog,
    addGameStateChangeLog,
    addEnemyDieLog,

    setScrollToBottomFn,

    gameFlushHandler,
  };
});