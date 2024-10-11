<script setup lang="ts">
import {
  CastTarget,
  type Equipment,
  type EquipmentRealTimeData,
  EquipmentType,
  type WeaponRealTimeData
} from "@/types/equipment-types";
import { computed, ref, watchEffect } from "vue";
import { useEquipmentStore } from "@/stores/equipment";
import RealTimeValue from "@/components/equipment/RealTimeValue.vue";
import { useEnemyStore } from "@/stores/enemy";

const props = defineProps<{
  equipmentDetail: Equipment;
}>();

const enemyStore = useEnemyStore();

const equipmentRealTimeStatus = computed<EquipmentRealTimeData|null>(() => {
  let realTimeStatus: EquipmentRealTimeData|null = null;
  if (props.equipmentDetail.type === EquipmentType.weapon) {
    realTimeStatus = {
      type: props.equipmentDetail.type,
      power: props.equipmentDetail.tableData.power,
      castTarget: CastTarget.enemy,
      effectiveInterval: props.equipmentDetail.tableData.effectiveInterval,
      attackType: props.equipmentDetail.tableData.attackType,
      lifeSteal: props.equipmentDetail.tableData.lifeSteal,
      accumulatedValue_Fire: props.equipmentDetail.tableData.accumulatedValue_Fire,
      accumulatedValue_Ice: props.equipmentDetail.tableData.accumulatedValue_Ice,
      accumulatedValue_Bleeding: props.equipmentDetail.tableData.accumulatedValue_Bleeding,
    } as WeaponRealTimeData;
    props.equipmentDetail.modifiers.forEach((modifier) => {
      realTimeStatus = modifier.tableData.modifier(realTimeStatus!);
    });
  }
  return realTimeStatus;
});

const effectiveInterval = computed(() => {
  if (equipmentRealTimeStatus.value && 'effectiveInterval' in equipmentRealTimeStatus.value) {
    return (equipmentRealTimeStatus.value as WeaponRealTimeData).effectiveInterval;
  }
  return 0;
});

const equipmentFullName = computed(() => {
  return props.equipmentDetail.fullName;
});

const equipmentStore = useEquipmentStore();

const highlightEquipment = () => {
  equipmentStore.highlightEquipment(props.equipmentDetail.id);
};
const effectiveGauge = ref(0);

const tryGetTargetEnemies = () => {
  if (enemyStore.mapIsEmpty) {
    return [];
  } else {
    if (props.equipmentDetail.type === EquipmentType.weapon) {
      return enemyStore.getEnemyPositionByAttackType((equipmentRealTimeStatus.value as WeaponRealTimeData).attackType);
    } else {
      // todo other equipment type
      return [];
    }
  }
};

const addToEffectiveGauge = (val: number) => {
  effectiveGauge.value += val;
  // 当装备主动攻击槽积累值大于攻击间隔时，尝试进行攻击
  if (effectiveGauge.value > effectiveInterval.value) {
    if (equipmentRealTimeStatus.value?.type === EquipmentType.weapon) {
      while (effectiveGauge.value > effectiveInterval.value) {
        const targetEnemiesPosition = tryGetTargetEnemies();
        if (targetEnemiesPosition.length > 0) {
          // 如果找到目标，则对找到的所有目标进行攻击，并将积累值减去攻击间隔
          enemyStore.attackEnemyAtPosition(targetEnemiesPosition, equipmentRealTimeStatus.value!);
          effectiveGauge.value = effectiveGauge.value - effectiveInterval.value;
        } else {
          // 如果没有找到目标，不进行攻击，并将积累值设置为攻击间隔，退出循环
          effectiveGauge.value = effectiveInterval.value;
          break;
        }
      }
    } else {
      // todo other equipment type
      effectiveGauge.value = effectiveInterval.value;
    }

  }
};

watchEffect((onCleanup) => {
  if (effectiveInterval.value > 0) {
    const gaugeSymbol = equipmentStore.addEffectiveGauge(addToEffectiveGauge);
    onCleanup(() => {
      equipmentStore.removeEffectiveGauge(gaugeSymbol);
    });
  }
});
</script>

<template>
  <div class="equipment-container" @mouseenter="highlightEquipment">
    <div class="equipment-card">
      <div class="equipment-full-name">{{ equipmentFullName }}</div>
      <div class="equipment-effective-gauge-container">
        <div
          class="equipment-effective-gauge-value"
          :style="{ width: `${Math.min(effectiveGauge / effectiveInterval * 100, 100)}%` }"
        />
      </div>
      <div style="margin-bottom: 6px;">
        <div>装备类型： {{ equipmentDetail.tableData.name }}</div>
        <div class="description-message">{{ equipmentDetail.tableData.description }}</div>
      </div>
      <template v-if="equipmentDetail.type === EquipmentType.weapon && equipmentRealTimeStatus?.type === EquipmentType.weapon">
        <div class="detail-message">
          <div class="message-row">
            <div>攻击力：</div>
            <RealTimeValue
              :real-time-value="equipmentRealTimeStatus.power"
              :base-value="equipmentDetail.tableData.power"
            />
          </div>
          <div class="message-row">
            <div>攻击间隔：</div>
            <RealTimeValue
              :real-time-value="equipmentRealTimeStatus.effectiveInterval"
              :base-value="equipmentDetail.tableData.effectiveInterval"
              reverse
            />
          </div>
          <div class="message-row" v-show="equipmentDetail.tableData.lifeSteal > 0">
            <div>吸血：</div>
            <span>
              <RealTimeValue
                :real-time-value="equipmentRealTimeStatus.lifeSteal"
                :base-value="equipmentDetail.tableData.lifeSteal"
              />
              <span>%</span>
            </span>
          </div>
          <div class="message-row" v-show="equipmentDetail.tableData.accumulatedValue_Fire > 0">
            <div>燃烧：</div>
            <RealTimeValue
              :real-time-value="equipmentRealTimeStatus.accumulatedValue_Fire"
              :base-value="equipmentDetail.tableData.accumulatedValue_Fire"
            />
          </div>
          <div class="message-row" v-show="equipmentDetail.tableData.accumulatedValue_Ice > 0">
            <div>冰冻：</div>
            <RealTimeValue
              :real-time-value="equipmentRealTimeStatus.accumulatedValue_Ice"
              :base-value="equipmentDetail.tableData.accumulatedValue_Ice"
            />
          </div>
          <div class="message-row" v-show="equipmentDetail.tableData.accumulatedValue_Bleeding > 0">
            <div>流血：</div>
            <RealTimeValue
              :real-time-value="equipmentRealTimeStatus.accumulatedValue_Bleeding"
              :base-value="equipmentDetail.tableData.accumulatedValue_Bleeding"
            />
          </div>
        </div>
      </template>
    </div>
    <div class="modifier-container" v-for="(modifier, modifierIndex) in equipmentDetail.modifiers" :key="modifierIndex">
      <div class="decoration-symbol-container">
        <div class="decoration-symbol" />
      </div>
      <div class="modifier-card">
        <div>
          <div>{{ modifier.fullName }}</div>
          <div class="description-message">{{ modifier.tableData.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.equipment-container {
  padding-top: 6px;
  width: 100%;
}

.equipment-container:hover {
  background-color: #eee;
}

.equipment-card {
  padding: 12px;
  margin: 0 6px 6px;
  border-radius: 4px;
  border: solid 2px #e06d6d;
  background-color: #fafafa;
}

.modifier-card {
  flex: 1;
  padding: 12px;
  margin: 6px;
  border-radius: 4px;
  border: solid 2px #68947f;
  background-color: #fafafa;
}

.equipment-full-name {
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  padding: 0 6px;
}

.modifier-container {
  display: flex;
}

.decoration-symbol-container {
  width: 48px;
  position: relative;
}

.decoration-symbol {
  right: 4px;
  top: 13px;
  width: 20px;
  height: 20px;
  border-bottom: solid 2px grey;
  border-left: solid 2px grey;
  position: absolute;
}

.detail-message {
  font-size: 14px;
  color: #333;
}
.message-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description-message {
  font-size: 12px;
  color: grey;
}


.equipment-effective-gauge-container {
  border: solid 1px grey;
  height: 16px;
  margin: 6px 0;
}

.equipment-effective-gauge-value {
  background-color: green;
  height: 100%;
  transition: width .1s linear;
}
</style>