import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useEquipmentStore } from "@/stores/equipment";
import { useEnemyStore } from "@/stores/enemy";

export const useGameCoreStore = defineStore('game-core', () => {

  // 游戏状态刷新的时间间隔为 100ms
  const GAME_FLUSH_INTERVAL = 100;
  const gameSpeedMultiplier = ref(1);

  // region 等级相关逻辑
  
  const level = ref(1);
  const XP_GAUGE_BASE_MAX = 100;
  const xpGaugeMax = computed(() => {
    return level.value * XP_GAUGE_BASE_MAX;
  });
  const xpGauge = ref(0);
  const addXP = (val: number) => {
    xpGauge.value += val;
    tryLevelUp();
  };
  
  
  const levelUp = () => {
    const equipmentStore = useEquipmentStore();
    level.value++;
    xpGauge.value -= xpGaugeMax.value;

    equipmentStore.addRandomNewChar();
  };
  
  const tryLevelUp = () => {
    const equipmentStore = useEquipmentStore();
    while (xpGauge.value >= xpGaugeMax.value) {
      if (equipmentStore.canAddNewChar) {
        levelUp();
      } else {
        return;
      }
    }
  };

  // endregion

  // region 游戏运行状态管理相关逻辑

  // 游戏状态刷新
  const gameStatusFlush = () => {
    const equipmentStore = useEquipmentStore();
    equipmentStore.gameFlushHandler(gameSpeedMultiplier.value * GAME_FLUSH_INTERVAL);

    const enemyStore = useEnemyStore();
    enemyStore.gameFlushHandler(gameSpeedMultiplier.value * GAME_FLUSH_INTERVAL);
  };

  let gameRunningInterval: any;

  const pauseGame = () => {
    clearInterval(gameRunningInterval);
    gameRunningInterval = null;
  };

  // todo Stop Game
  const stopGame = () => {
    clearInterval(gameRunningInterval);
    gameRunningInterval = null;
  };
  
  const startGame = () => {
    if (!gameRunningInterval) {
      gameRunningInterval = setInterval(gameStatusFlush, GAME_FLUSH_INTERVAL);
    }
  };

  // endregion
  
  
  return {
    gameSpeedMultiplier,
    level,
    xpGauge,
    xpGaugeMax,

    addXP,
    tryLevelUp,
    startGame,
    pauseGame,
    stopGame,
  };
});