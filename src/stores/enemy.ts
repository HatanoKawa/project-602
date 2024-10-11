import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGameCoreStore } from "@/stores/game-core";
import type { EnemyRealTimeData } from "@/types/enemy-types";
import { tableData_Enemy } from "@/db";
import type { WeaponRealTimeData } from "@/types/equipment-types";
import { EquipmentAttackType } from "@/types/db-types";

export interface MapSlotData {
  enemy: EnemyRealTimeData | null;
}

export const useEnemyStore = defineStore('enemy', () => {

  const gameCoreStore = useGameCoreStore();
  const currentEnemyStateMultipliers = computed(() => 1 + Math.pow(gameCoreStore.level * 0.1, 2));
  const currentEnemyRank = computed(() => Math.floor(gameCoreStore.level / 10));
  const currentPossibleEnemyList = computed(() => {
    return tableData_Enemy.filter(enemy => enemy.rank === currentEnemyRank.value);
  });

  // 地图格子列表，用于敌人生成，格子的尺寸为 5行x4列
  const mapSlotList = ref<MapSlotData[][]>([]);
  const canAddEnemy = computed(() => mapSlotList.value.some(row => row.some(slot => !slot.enemy)));
  const mapIsEmpty = computed(() => !mapSlotList.value.some(row => row.some(slot => slot.enemy)));
  const ENEMY_GENERATE_INTERVAL = 1000;
  const enemyWaitTime = ref(0);

  const generateNewEnemyRealTimeData = () => {
    const randomEnemyTableData = currentPossibleEnemyList.value[Math.floor(Math.random() * currentPossibleEnemyList.value.length)];
    return {
      health: randomEnemyTableData.healthMax * currentEnemyStateMultipliers.value,
      healthMax: randomEnemyTableData.healthMax * currentEnemyStateMultipliers.value,
      elementalGauge_Fire: randomEnemyTableData.elementalGaugeMax_Fire,
      elementalGauge_Ice: randomEnemyTableData.elementalGaugeMax_Ice,
      elementalGauge_Bleeding: randomEnemyTableData.elementalGaugeMax_Bleeding,
      tableData: randomEnemyTableData,
    } as EnemyRealTimeData;
  };
  
  const addNewEnemyToRandomEmptyMapSlot = () => {
    const newEnemyRealTimeData = generateNewEnemyRealTimeData();
    
    const emptySlotList: { row: number, col: number }[] = [];
    mapSlotList.value.forEach((row, rowIndex) => {
      row.forEach((slot, colIndex) => {
        if (!slot.enemy) {
          emptySlotList.push({ row: rowIndex, col: colIndex });
        }
      });
    });
    if (emptySlotList.length === 0) {
      // 正常运行状态下不应该出现这种情况，仅作为防御性逻辑
      return;
    }
    const randomEmptySlot = emptySlotList[Math.floor(Math.random() * emptySlotList.length)];
    mapSlotList.value[randomEmptySlot.row][randomEmptySlot.col].enemy = newEnemyRealTimeData;
  };

  const addWaitingTime = (val: number) => {
    enemyWaitTime.value += val;
    // 正常情况下，已等待时间不可能超过 2 倍的生成间隔时间，直接使用 if 替代 while 进行判断
    if (enemyWaitTime.value >= ENEMY_GENERATE_INTERVAL) {
      if (!canAddEnemy.value) {
        // todo 没有空位可以添加，判定为游戏失败，执行游戏结束的逻辑
        console.error('failed');
        gameCoreStore.stopGame();
        return;
      }
      addNewEnemyToRandomEmptyMapSlot();
      enemyWaitTime.value -= ENEMY_GENERATE_INTERVAL;
    }
  };

  // private
  const pickRandomEnemy = (count: number = 1) => {
    const enemyList: [number, number][] = [];
    mapSlotList.value.forEach((row, rowIndex) => {
      row.forEach((slot, colIndex) => {
        if (slot.enemy) {
          enemyList.push([rowIndex, colIndex]);
        }
      });
    });
    if (enemyList.length === 0) {
      return [];
    }
    return pickRandomEnemyFromList(enemyList, count);
  };

  // default as lowest
  const pickRandomEnemyWithLowestOrHighestHealth = (count: number = 1, lowest: boolean = true) => {
    const enemyList: [number, number][] = [];
    mapSlotList.value.forEach((row, rowIndex) => {
      row.forEach((slot, colIndex) => {
        if (slot.enemy) {
          enemyList.push([rowIndex, colIndex]);
        }
      });
    });
    if (enemyList.length === 0) {
      return [];
    }
    const sortedEnemyList = enemyList.sort((a, b) => {
      return mapSlotList.value[a[0]][a[1]].enemy!.health - mapSlotList.value[b[0]][b[1]].enemy!.health * (lowest ? 1 : -1);
    });
    return pickRandomEnemyFromList(sortedEnemyList, count);
  };
  
  const pickRandomEnemyFromList = (positionList: [number, number][], count: number) => {
    const tempPositionList = [...positionList];
    const result: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      const randomEnemy = tempPositionList[Math.floor(Math.random() * tempPositionList.length)];
      result.push(randomEnemy);
      tempPositionList.splice(tempPositionList.indexOf(randomEnemy), 1);
    }
    return result;
  };
  
  const expandAttackRange_3x3 = (positionList: [number, number][]) => {
    const result: [number, number][] = [];
    positionList.forEach(([rowIndex, colIndex]) => {
      for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
        for (let j = colIndex - 1; j <= colIndex + 1; j++) {
          if (i >= 0 && i < 5 && j >= 0 && j < 4) {
            result.push([i, j]);
          }
        }
      }
    });
    return result;
  };

  // 将伤害范围向4个方向扩展1格
  const expandAttackRange_Cross = (positionList: [number, number][]) => {
    const result: [number, number][] = [];
    positionList.forEach(([rowIndex, colIndex]) => {
      for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
        if (i >= 0 && i < 5) {
          result.push([i, colIndex]);
        }
      }
      for (let j = colIndex - 1; j <= colIndex + 1; j++) {
        if (j >= 0 && j < 4) {
          result.push([rowIndex, j]);
        }
      }
    });
    return result;
  };
  
  const getEnemyPositionByAttackType = (attackType: EquipmentAttackType) => {
    switch (attackType) {
    case EquipmentAttackType.sword:
      return pickRandomEnemy(1);
    case EquipmentAttackType.stick:
      return expandAttackRange_3x3(pickRandomEnemy(1));
    case EquipmentAttackType.bow:
      return pickRandomEnemyWithLowestOrHighestHealth(1, true);
    case EquipmentAttackType.spear:
      return pickRandomEnemyWithLowestOrHighestHealth(1, false);
    case EquipmentAttackType.axe:
      return expandAttackRange_Cross(pickRandomEnemyWithLowestOrHighestHealth(1, false));
    }
  };
  
  const removeEnemyAtPosition = (positionList: [number, number]) => {
    mapSlotList.value[positionList[0]][positionList[1]].enemy = null;
  };

  // 点燃效果，对十字形4个方向1格内的敌人造成伤害
  const igniteEffect = (enemyPosition: [number, number]) => {
    const crossPositionList = expandAttackRange_Cross([enemyPosition]);
    crossPositionList.forEach(position => {
      const enemyRealTimeData = mapSlotList.value[position[0]][position[1]].enemy;
      if (enemyRealTimeData) {
        enemyRealTimeData.health -= enemyRealTimeData.healthMax * 0.1;
        settleEnemyState(position);
      }
    });
  };

  // 结算敌人状态
  const settleEnemyState = (enemyPosition: [number, number]) => {
    const enemyRealTimeData = mapSlotList.value[enemyPosition[0]][enemyPosition[1]].enemy;
    if (enemyRealTimeData) {
      if (enemyRealTimeData.elementalGauge_Fire >= enemyRealTimeData.tableData.elementalGaugeMax_Fire) {
        // 点燃效果，最优先结算，通过 return 和 igniteEffect方法 实现循环触发
        enemyRealTimeData.elementalGauge_Fire -= enemyRealTimeData.tableData.elementalGaugeMax_Fire;
        igniteEffect(enemyPosition);
        return;
      }
      while (enemyRealTimeData.elementalGauge_Ice >= enemyRealTimeData.tableData.elementalGaugeMax_Ice) {
        enemyRealTimeData.health -= 100;
        enemyRealTimeData.elementalGauge_Ice = 0;
      }
      while (enemyRealTimeData.elementalGauge_Bleeding >= enemyRealTimeData.tableData.elementalGaugeMax_Bleeding) {
        enemyRealTimeData.health *= 0.5;
        enemyRealTimeData.elementalGauge_Bleeding = 0;
      }
      if (enemyRealTimeData.health <= 0) {
        gameCoreStore.addXP(enemyRealTimeData.tableData.xpReward);
        removeEnemyAtPosition(enemyPosition);
      }
    }
  };
  
  const attackEnemyAtPosition = (positionList: [number, number][], weapon: WeaponRealTimeData) => {
    positionList.forEach(([rowIndex, colIndex]) => {
      const enemyRealTimeData = mapSlotList.value[rowIndex][colIndex].enemy;
      if (enemyRealTimeData) {
        enemyRealTimeData.health -= weapon.power;
        enemyRealTimeData.elementalGauge_Fire += weapon.accumulatedValue_Fire;
        enemyRealTimeData.elementalGauge_Ice += weapon.accumulatedValue_Ice;
        enemyRealTimeData.elementalGauge_Bleeding += weapon.accumulatedValue_Bleeding;
        
        settleEnemyState([rowIndex, colIndex]);
      }
    });
  };
  
  const gameFlushHandler = (increaseTime: number) => {
    addWaitingTime(increaseTime);
  };
  
  const init = () => {
    mapSlotList.value = Array.from(
      { length: 5 },
      () =>
        Array.from(
          { length: 4 },
          () => ({
            enemy: null,
          } as MapSlotData)
        )
    );
  };
  init();
  
  return {
    mapSlotList,
    mapIsEmpty,
    currentEnemyStateMultipliers,

    gameFlushHandler,
    getEnemyPositionByAttackType,
    attackEnemyAtPosition,
  };
});