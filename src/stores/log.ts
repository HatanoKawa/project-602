import { defineStore } from "pinia";
import { ref } from "vue";
import { type LogData, LogType } from "@/types/log-types";

export const useLogStore = defineStore('log', () => {
  const fullLogList = ref<LogData[]>([]);
  const logListToAdd = ref<LogData[]>([]);

  const addEquipmentAttackLog = (equipmentId: string, equipmentName: string, target: string[], damage: number) => {
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
  
  const addElementalEffectLog = (elementalEffectName: string, elementalEffectColor: string, target: string[], damage: number) => {
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

    addEquipmentAttackLog,
    addElementalEffectLog,
    addGameStateChangeLog,
    addEnemyDieLog,

    setScrollToBottomFn,

    gameFlushHandler,
  };
});