import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGameCoreStore } from "@/stores/game-core";
import type { EnemyRealTimeData } from "@/types/enemy-types";

export interface MapSlotData {
  enemy: EnemyRealTimeData | null;
}

export const useEnemyStore = defineStore('enemy', () => {

  const gameCoreStore = useGameCoreStore();
  const currentEnemyStateMultipliers = computed(() => gameCoreStore.level);

  // 地图格子列表，用于敌人生成，格子的尺寸为 5行x4列
  const mapSlotList = ref<MapSlotData[][]>(
    Array.from(
      { length: 5 },
      () => 
        Array.from(
          { length: 4 },
          () => ({
            enemy: null,
          } as MapSlotData)
        )
    )
  );
  const canAddEnemy = computed(() => mapSlotList.value.some(row => row.some(slot => !slot.enemy)));
  const ENEMY_GENERATE_INTERVAL = 2000;
  const enemyWaitTime = ref(0);

  const generateNewEnemy = () => {
    
  };

  const addNewEnemy = (enemy: EnemyRealTimeData) => {
    
  };
  
  const gameFlushHandler = (increaseValue: number) => {
    
  };
  
  return {
    mapSlotList,

    gameFlushHandler,
  };
});