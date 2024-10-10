import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useGameCoreStore = defineStore('game-core', () => {
  // 游戏速度倍率
  const GAME_FLUSH_INTERVAL = 100;
  const gameSpeedMultiplier = ref(1);

  // 每回合增长量
  const ROUND_GROWTH = 10;
  const actualRoundGrowth = computed(() => ROUND_GROWTH * gameSpeedMultiplier.value);
  const effectiveGaugeIncreaseFunctionDict: Record<symbol, (val: number) => void> = {};
  let gameRunningInterval: any;
  const addAllEffectiveGauge = () => {
    Object.getOwnPropertySymbols(effectiveGaugeIncreaseFunctionDict).forEach((key) => {
      effectiveGaugeIncreaseFunctionDict[key](actualRoundGrowth.value);
    });
  };

  const addEffectiveGauge = (effectiveGauge: (val: number) => void) => {
    const key = Symbol();
    effectiveGaugeIncreaseFunctionDict[key] = effectiveGauge;
    return key;
  };

  const removeEffectiveGauge = (key: symbol) => {
    console.log('removeEffectiveGauge', key);
    delete effectiveGaugeIncreaseFunctionDict[key];
  };

  // 游戏状态刷新
  const gameStatusFlush = () => {
    addAllEffectiveGauge();
  };
  
  const pauseGame = () => {
    clearInterval(gameRunningInterval);
    gameRunningInterval = null;
  };

  const stopGame = () => {
    clearInterval(gameRunningInterval);
    gameRunningInterval = null;
  };
  
  const startGame = () => {
    if (!gameRunningInterval) {
      gameRunningInterval = setInterval(gameStatusFlush, GAME_FLUSH_INTERVAL);
    }
  };
  
  
  return {
    gameSpeedMultiplier,
    actualRoundGrowth,
    effectiveGaugeIncreaseFunctionDict,


    addEffectiveGauge,
    removeEffectiveGauge,
    startGame,
    pauseGame,
    stopGame,
  };
});