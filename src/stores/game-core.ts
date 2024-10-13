import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useEquipmentStore } from "@/stores/equipment";
import { useEnemyStore } from "@/stores/enemy";
import { useLogStore } from "@/stores/log";

export const useGameCoreStore = defineStore('game-core', () => {

  const debugMode = ref(true);

  // 游戏状态刷新的时间间隔为 100ms
  const GAME_FLUSH_INTERVAL = 100;
  const GAME_SPEED_POSSIBLE_VALUES = [0.5, 1, 2, 4] as const;
  const gameSpeedMultiplier = ref<typeof GAME_SPEED_POSSIBLE_VALUES[number]>(1);
  const increaseTimePerFlush = computed(() => GAME_FLUSH_INTERVAL * gameSpeedMultiplier.value);

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
    xpGauge.value -= xpGaugeMax.value;
    level.value++;

    const equipmentStore = useEquipmentStore();
    equipmentStore.tryAddRandomNewChar();
  };
  
  const tryLevelUp = () => {
    while (xpGauge.value >= xpGaugeMax.value) {
      levelUp();
    }
  };

  // endregion

  // region 游戏运行状态管理相关逻辑

  // 游戏状态刷新
  const gameStatusFlush = () => {
    const equipmentStore = useEquipmentStore();
    equipmentStore.gameFlushHandler(increaseTimePerFlush.value);

    const enemyStore = useEnemyStore();
    enemyStore.gameFlushHandler(increaseTimePerFlush.value);

    const logStore = useLogStore();
    logStore.gameFlushHandler(increaseTimePerFlush.value);
  };

  let gameRunningInterval: any;

  const pauseGame = () => {
    clearInterval(gameRunningInterval);
    gameRunningInterval = null;
  };

  const stopGame = () => {
    clearInterval(gameRunningInterval);
    gameRunningInterval = null;

    const logStore = useLogStore();
    const totalDamage =
      logStore.damageAnalysis.weapon +
      logStore.damageAnalysis.elemental_Ignite +
      logStore.damageAnalysis.elemental_Freeze +
      logStore.damageAnalysis.elemental_Bleeding;

    logStore.addGameStateChangeLog(`游戏结束，总伤害为： ${totalDamage.toFixed(2)}`);
    // todo Stop Game Logic
  };
  
  const startGame = () => {
    const logStore = useLogStore();
    logStore.addGameStateChangeLog('游戏开始');

    if (!gameRunningInterval) {
      gameRunningInterval = setInterval(gameStatusFlush, GAME_FLUSH_INTERVAL);
    }
  };

  // endregion
  
  
  return {
    debugMode,

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