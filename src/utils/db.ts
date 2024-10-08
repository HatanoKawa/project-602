export enum AttackType {
  // 剑/刀 对随机敌人进行单体攻击
  sword = 'sword',
  // 棍/杖 选取随机敌人进行3x3范围攻击
  stick = 'stick',
  // 弓 优先攻击血量最少的敌人
  bow = 'bow',
  // 矛枪戟 优先攻击攻击力最高的敌人
  spear = 'spear',
  // 斧 优先攻击血量最高的敌人，并造成十字范围伤害
  axe = 'axe',
}

export enum PropsType {
  weapon = 'weapon',
  item = 'item',
  armor = 'armor',
}

export interface WeaponBaseData {
  matchName: string;
  fullName: string;
  power: number;
  attackInterval: number;
  attackType: AttackType;
  description: string;
  // 吸血倍率， 1.0 = 100%
  lifeSteal: number;
  accumulatedValue_Fire: number;
  accumulatedValue_Ice: number;
  accumulatedValue_Bleeding: number;
  derivative?: WeaponBaseData[];
}

export interface WeaponRealTimeData {
  type: PropsType.weapon;
  power: number;
  attackInterval: number;
  attackType: AttackType;
  lifeSteal: number;
  accumulatedValue_Fire: number;
  accumulatedValue_Ice: number;
  accumulatedValue_Bleeding: number;
  baseData: WeaponBaseData;
}

export interface ItemBaseData {
  matchName: string;
  fullName: string;
  description: string;
  derivative?: ItemBaseData[];
}

export interface ItemRealTimeData {
  type: PropsType.item;
  baseData: ItemBaseData;
}

export interface ArmorBaseData {
  matchName: string;
  fullName: string;
  description: string;
  derivative?: ArmorBaseData[];
}

export interface ArmorRealTimeData {
  type: PropsType.armor;
  baseData: ArmorBaseData;
}

export type PropsRealTimeData = WeaponRealTimeData|ItemRealTimeData|ArmorRealTimeData

// region 武器数值

// 用于匹配武器类型
export const weaponTree: WeaponBaseData[] = [
  {
    matchName: '刀',
    fullName: '刀',
    power: 100,
    attackInterval: 500,
    attackType: AttackType.sword,
    description: '只是普通的刀',
    lifeSteal: 0,
    accumulatedValue_Fire: 0,
    accumulatedValue_Ice: 0,
    accumulatedValue_Bleeding: 0,
    derivative: [
      {
        matchName: '偃月',
        fullName: '偃月刀',
        power: 150,
        attackInterval: 400,
        attackType: AttackType.sword,
        description: '偃月刀',
        lifeSteal: 0,
        accumulatedValue_Fire: 0,
        accumulatedValue_Ice: 0,
        accumulatedValue_Bleeding: 0,
        derivative: [
          {
            matchName: '青龙',
            fullName: '青龙偃月刀',
            power: 300,
            attackInterval: 300,
            attackType: AttackType.sword,
            description: '大名鼎鼎的青龙偃月刀',
            lifeSteal: 0,
            accumulatedValue_Fire: 100,
            accumulatedValue_Ice: 0,
            accumulatedValue_Bleeding: 0,
          }
        ]
      },
      {
        matchName: '妖',
        fullName: '妖刀',
        power: 10,
        attackInterval: 100,
        attackType: AttackType.sword,
        description: '妖刀',
        lifeSteal: 5,
        accumulatedValue_Fire: 0,
        accumulatedValue_Ice: 0,
        accumulatedValue_Bleeding: 50,
        derivative: [
          {
            matchName: '村正',
            fullName: '村正妖刀',
            power: 20,
            attackInterval: 100,
            attackType: AttackType.sword,
            description: '大名鼎鼎的村正妖刀',
            lifeSteal: 10,
            accumulatedValue_Fire: 0,
            accumulatedValue_Ice: 0,
            accumulatedValue_Bleeding: 100,
          }
        ]
      }
    ],
  },
  {
    matchName: '棍',
    fullName: '棍',
    power: 50,
    attackInterval: 1000,
    attackType: AttackType.stick,
    description: '只是普通的棍',
    lifeSteal: 0,
    accumulatedValue_Fire: 0,
    accumulatedValue_Ice: 0,
    accumulatedValue_Bleeding: 0,
  },
  {
    matchName: '弓',
    fullName: '弓',
    power: 150,
    attackInterval: 800,
    attackType: AttackType.bow,
    description: '只是普通的弓',
    lifeSteal: 0,
    accumulatedValue_Fire: 0,
    accumulatedValue_Ice: 0,
    accumulatedValue_Bleeding: 0,
  },
  {
    matchName: '矛',
    fullName: '矛',
    power: 70,
    attackInterval: 600,
    attackType: AttackType.spear,
    description: '只是普通的矛',
    lifeSteal: 0,
    accumulatedValue_Fire: 0,
    accumulatedValue_Ice: 0,
    accumulatedValue_Bleeding: 0,
    derivative: [
      {
        matchName: '蛇',
        fullName: '蛇矛',
        power: 100,
        attackInterval: 1000,
        attackType: AttackType.spear,
        description: '蛇矛',
        lifeSteal: 0,
        accumulatedValue_Fire: 0,
        accumulatedValue_Ice: 0,
        accumulatedValue_Bleeding: 0,
        derivative: [
          {
            matchName: '丈八',
            fullName: '丈八蛇矛',
            power: 200,
            attackInterval: 500,
            attackType: AttackType.spear,
            description: '大名鼎鼎的丈八蛇矛',
            lifeSteal: 0,
            accumulatedValue_Fire: 0,
            accumulatedValue_Ice: 100,
            accumulatedValue_Bleeding: 0,
          }
        ]
      }
    ],
  },
  {
    matchName: '斧',
    fullName: '斧',
    power: 100,
    attackInterval: 800,
    attackType: AttackType.axe,
    description: '只是普通的斧',
    lifeSteal: 0,
    accumulatedValue_Fire: 0,
    accumulatedValue_Ice: 0,
    accumulatedValue_Bleeding: 0,
  },
]
// 用于反查武器相关数值
export const weaponDict: Record<string, WeaponBaseData> = {}

// endregion

// region 道具数值

export const itemTree: ItemBaseData[] = [
  {
    matchName: '壶',
    fullName: '壶',
    description: '可以装各种液体，也可以用来砸人，惊险又刺激。',
  },
  {
    matchName: '鞘',
    fullName: '鞘',
    description: '这没了刀，鞘还是鞘吗？',
  },
]
export const itemDict: Record<string, ItemBaseData> = {}

// endregion

// region 防具数值

export const armorTree: ArmorBaseData[] = [
]
export const armorDict: Record<string, ArmorBaseData> = {}

// endregion

// region 修饰器

export const singleCharacterModifierData: { name: string|string[], modifier: (data: PropsRealTimeData) => PropsRealTimeData }[] = [
  {
    name: ['锐', '利'],
    modifier: (data) => {
      if (data.type === PropsType.weapon) {
        data.power *= 1.1;
        data.accumulatedValue_Bleeding += 10;
      }
      return data;
    }
  },
  {
    name: '长',
    modifier: (data) => {
      if (data.type === PropsType.weapon) {
        data.power *= 1.2;
        data.attackInterval *= 0.9;
      }
      return data;
    }
  },
  {
    name: '火',
    modifier: (data) => {
      if (data.type === PropsType.weapon) {
        data.accumulatedValue_Fire += 10;
      }
      return data;
    }
  },
  {
    name: '冰',
    modifier: (data) => {
      if (data.type === PropsType.weapon) {
        data.accumulatedValue_Ice += 10;
      }
      return data;
    }
  },
]

export const multipleCharacterModifierData: { name: string|string[], modifier: (data: PropsRealTimeData) => PropsRealTimeData }[] = [
  {
    name: '锐利',
    modifier: (data) => {
      if (data.type === PropsType.weapon) {
        data.power *= 1.6;
        data.accumulatedValue_Bleeding += 50;
      }
      return data;
    }
  }
]

// endregion

export let charFullSet: string = ''

// region 初始化

const buildWeaponDict = (weaponTree: WeaponBaseData[]) => {
  weaponTree.forEach(weapon => {
    weaponDict[weapon.matchName] = weapon;
    if (weapon.derivative) {
      buildWeaponDict(weapon.derivative);
    }
  })
}

const buildItemDict = (itemTree: ItemBaseData[]) => {
  itemTree.forEach(item => {
    itemDict[item.matchName] = item;
    if (item.derivative) {
      buildItemDict(item.derivative);
    }
  })
}

const buildArmorDict = (armorTree: ArmorBaseData[]) => {
  armorTree.forEach(armor => {
    armorDict[armor.matchName] = armor;
    if (armor.derivative) {
      buildArmorDict(armor.derivative);
    }
  })
}

const buildCharFullSet = () => {
  Object.values(weaponDict).forEach(weapon => {
    charFullSet += weapon.matchName;
  })
  Object.values(itemDict).forEach(item => {
    charFullSet += item.matchName;
  })
  Object.values(armorDict).forEach(armor => {
    charFullSet += armor.matchName;
  })
  singleCharacterModifierData.forEach(modifier => {
    charFullSet += typeof modifier.name == 'string' ? modifier.name : modifier.name.join('');
  })
  multipleCharacterModifierData.forEach(modifier => {
    charFullSet += typeof modifier.name == 'string' ? modifier.name : modifier.name.join('');
  })
}

export const init = () => {
  buildWeaponDict(weaponTree);
  buildItemDict(itemTree);
  buildArmorDict(armorTree);
  buildCharFullSet();
}

init();
// endregion